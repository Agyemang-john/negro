from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from rest_framework import status, views
from .models import Cart, CartItem
from product.models import Product, Variants
from rest_framework.response import Response
from django.utils.crypto import get_random_string
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from product.models import Product, ProductDeliveryOption
from rest_framework.permissions import IsAuthenticated


from django.http import JsonResponse
from rest_framework import status, views
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from order.models import Cart, CartItem
from product.models import Product, Variants, ProductDeliveryOption
from .utils import get_cart, create_or_get_cart
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.views import APIView



class AddToCartView(views.APIView):
    def post(self, request):
        data = request.data

        product_id = data.get("product_id")
        variant_id = data.get("variant_id")
        quantity = int(data.get("quantity"))
        is_in_cart = False

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise NotFound(detail="Product not found.")

        # Fetch the product
        product = get_object_or_404(Product, id=product_id)

        # Fetch variant (if applicable)
        variant = get_object_or_404(Variants, id=variant_id, product=product) if variant_id else None
        cart = create_or_get_cart(request)

        default_delivery_option = ProductDeliveryOption.objects.filter(
            product=product, default=True
        ).first()

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            variant=variant,
            defaults={
                "quantity": quantity,
                "delivery_option": default_delivery_option.delivery_option if default_delivery_option else None,
            },
        )

        if not created:
            # If the item already exists, increase the quantity
            cart_item.quantity += quantity
            cart_item.save()

        # should delete the cart item if it gets to 0
        if cart_item.quantity < 1:
            cart_item.delete()
            is_in_cart = False
            message = "Item removed from cart."
            res_quantity = 0
        else:
            is_in_cart = True
            res_quantity = cart_item.quantity
            if created:
                message = "Item added to cart."
            elif quantity > 0:
                message = "Item quantity increased."
            else:
                message = "Item quantity decreased."


        return Response({
            "message": message,
            "quantity": res_quantity,
            "is_in_cart": is_in_cart,
        })


class RemoveFromCartView(views.APIView):
    def post(self, request):
        data = request.data

        product_id = data.get("product_id")
        variant_id = data.get("variant_id", None)

        # Get or create the cart (handles both authenticated and guest users)
        cart = create_or_get_cart(request)

        # Fetch the product
        product = get_object_or_404(Product, id=product_id)

        # Fetch variant (if applicable)
        variant = get_object_or_404(Variants, id=variant_id) if variant_id else None

        # Find the cart item
        try:
            cart_item = CartItem.objects.get(cart=cart, product=product, variant=variant)
            cart_item.delete()  # Remove the item from the cart
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)

        # If we created a response (e.g., setting a new cart cookie), return it
        response_data = {"message": "Item removed from cart"}
        if response:
            response_data["cart_session_id"] = request.COOKIES.get("cart_session_id")
            response = JsonResponse(response_data, status=status.HTTP_200_OK)
            return response

        return Response(response_data, status=status.HTTP_200_OK)

class CartQuantityView(APIView):
    """Retrieve the total quantity of items in the user's cart without creating a new cart."""

    def get(self, request):
        cart = get_cart(request)  # Use optimized function

        total_quantity = cart.total_quantity if cart else 0
        return Response({"quantity": total_quantity}, status=status.HTTP_200_OK)