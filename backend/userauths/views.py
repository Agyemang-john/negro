
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
import logging

from order.utils import merge_guest_cart_with_user_cart
from djoser.social.views import ProviderAuthView
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from django.conf import settings
from rest_framework.response import Response

class CustomProviderAuthView(ProviderAuthView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 201:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response.set_cookie(
                'access',
                access_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )
            response.set_cookie(
                'refresh',
                refresh_token,
                max_age=settings.AUTH_COOKIE_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

        return response



class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get("access")
            refresh_token = response.data.get("refresh")

            # Set HTTP-only cookies
            response.set_cookie(
                "access",
                access_token,
                max_age=settings.AUTH_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )
            response.set_cookie(
                "refresh",
                refresh_token,
                max_age=settings.AUTH_REFRESH_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

            try:
                merge_guest_cart_with_user_cart(request)
            except Exception as e:
                logger.warning(f"Guest cart merge failed: {e}")


            # Remove tokens from response body for extra security
            del response.data["access"]
            del response.data["refresh"]

        return response

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')

        if refresh_token:
            request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')

            # Set the token in cookie
            response.set_cookie(
                "access",
                access_token,
                max_age=settings.AUTH_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

            # ✅ Keep it in the response body *only* if from SSR (optional header flag)
            if request.headers.get("X-SSR-Refresh") == "true":
                pass  # leave token in body for SSR
            else:
                del response.data["access"]

        return response



class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        access_token = request.COOKIES.get('access')

        if access_token:
            request.data['token'] = access_token

        return super().post(request, *args, **kwargs)



class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('access')
        response.delete_cookie('refresh')

        return response
