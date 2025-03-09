import uuid
from django.utils.deprecation import MiddlewareMixin
from .models import Cart

class CartIDMiddleware(MiddlewareMixin):

    def process_response(self, request, response):
        if not request.COOKIES.get("cart_id"):
            cart_id = str(uuid.uuid4())
            response.set_cookie(
                key="cart_id",
                value=cart_id,
                max_age=365 * 24 * 60 * 60,  # 120 days
                path='/',
                secure=False,
                httponly=True,
                samesite="Lax",
            )
        return response
