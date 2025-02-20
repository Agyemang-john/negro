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


def get_or_create_cart(request):
    """Retrieve or create a cart for an authenticated user or a guest using cookies."""
    user = request.user if request.user.is_authenticated else None
    cart_session_id = request.COOKIES.get('cart_session_id')

    if user:
        # Authenticated users: Retrieve or create their cart
        cart, _ = Cart.objects.get_or_create(user=user)
        response = None  # No need to set cookies for authenticated users
    else:
        # Guest users: Use session_id from cookies or create a new one
        if not cart_session_id:
            cart_session_id = get_random_string(32)  # Generate unique session ID
            response = JsonResponse({'message': 'New session created'})
            response.set_cookie('cart_session_id', cart_session_id, max_age=60*60*24*180, httponly=True, samesite='Lax')
        else:
            response = None

        # Retrieve or create a cart for guest users
        cart, _ = Cart.objects.get_or_create(session_id=cart_session_id, user=None)

    return response, cart

class AddToCartView(views.APIView):
    def post(self, request):
        data = request.data

        product_id = data.get("product_id")
        variant_id = data.get("variant_id", None)
        quantity = int(data.get("quantity", 1))

        # Get or create the cart (handles both authenticated and guest users)
        response, cart = get_or_create_cart(request)

        # Fetch the product
        product = get_object_or_404(Product, id=product_id)

        # Fetch variant (if applicable)
        variant = get_object_or_404(Variants, id=variant_id) if variant_id else None

        default_delivery_option = ProductDeliveryOption.objects.filter(
            product=product, default=True
        ).first()

        # Check if the product (or variant) already exists in the cart
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, 
            product=product, 
            variant=variant, 
            defaults={
                'quantity': quantity,
                'delivery_option': default_delivery_option.delivery_option if default_delivery_option else None
            }
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        response_data = {"message": "Item added to cart", "cart_item_id": cart_item.id}
        
        # If we created a response (e.g., setting a new cart cookie), return it
        if response:
            response_data["cart_session_id"] = request.COOKIES.get("cart_session_id")
            response = JsonResponse(response_data, status=status.HTTP_200_OK)
            return response

        return Response(response_data, status=status.HTTP_200_OK)

class RemoveFromCartView(views.APIView):
    def post(self, request):
        data = request.data

        product_id = data.get("product_id")
        variant_id = data.get("variant_id", None)

        # Get or create the cart (handles both authenticated and guest users)
        response, cart = get_or_create_cart(request)

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

class CartQuantityView(views.APIView):
    def get(self, request):
        # Get or create the cart (handles both authenticated and guest users)
        _, cart = get_or_create_cart(request)
        quantity = cart.total_quantity

        return Response({"quantity": quantity}, status=status.HTTP_200_OK)
