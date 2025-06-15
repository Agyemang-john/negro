
import json
import logging
from rest_framework.response import Response
from rest_framework import status
from product.models import Product, Variants
from .models import Cart
from product.serializers import ProductSerializer, VariantSerializer
from .serializers import CartItemSerializer

logger = logging.getLogger(__name__)

def calculate_packaging_fee(weight, volume):
    # Example rates, adjust as needed
    weight_rate = 1.0  # Packaging fee per kg
    volume_rate = 1.0  # Packaging fee per cubic meter

    weight_fee = weight * weight_rate
    volume_fee = volume * volume_rate

    # Choose the higher fee or sum both if needed
    # packaging_fee = max(weight_fee, volume_fee)
    packaging_fee = weight_fee + volume_fee
    return packaging_fee


def get_authenticated_cart_response(request):
    cart = Cart.objects.get_for_request(request)
    if not cart:
        return Response(
            {"detail": "Cart not found", "items": [], "total_amount": 0, "packaging_fee": 0},
            status=status.HTTP_200_OK
        )

    cart_items = cart.cart_items.all()
    total_amount = cart.total_price
    packaging_fee = cart.calculate_packaging_fees()

    return Response({
        "items": CartItemSerializer(cart_items, context={'request': request}, many=True).data,
        "total_amount": total_amount,
        "packaging_fee": packaging_fee,
        "cart_id": cart.id
    })


def get_guest_cart_response(request):
    guest_cart_header = request.headers.get('X-Guest-Cart')
    try:
        guest_cart = json.loads(guest_cart_header) if guest_cart_header else []
    except (json.JSONDecodeError, TypeError):
        guest_cart = []

    items = []
    total_amount = 0
    packaging_fee = 0

    for item in guest_cart:
        try:
            product_id = item.get("p")
            quantity = int(item.get("q", 0))
            variant_id = item.get("v")

            product = Product.objects.get(id=product_id, status="published")
            variant = None
            price = product.price

            if variant_id:
                variant = Variants.objects.get(id=variant_id, product=product)
                price = variant.price

            item_data = {
                "product": ProductSerializer(product, context={'request': request}).data,
                "variant": VariantSerializer(variant, context={'request': request}).data if variant else None,
                "quantity": quantity,
                "subtotal": price * quantity,
            }

            items.append(item_data)
            total_amount += price * quantity
            packaging_fee += calculate_packaging_fee(product.weight, product.volume) * quantity

        except Exception as e:
            logger.warning(f"Error processing guest cart item: {e}")
            continue

    return Response({
        "items": items,
        "total_amount": total_amount,
        "packaging_fee": packaging_fee,
        "cart_id": None
    })

