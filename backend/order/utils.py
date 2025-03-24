from django.http import JsonResponse
from django.db import transaction
from django.http import JsonResponse
from .models import Cart, CartItem
import uuid

from django.core.exceptions import ObjectDoesNotExist

def get_cart(request):
    """Retrieve an existing cart without creating a new one unnecessarily."""
    session_cart_id = request.COOKIES.get("cart_id")
    if request.user.is_authenticated:
        try:
            return Cart.objects.get(user=request.user)  # Avoid unnecessary creation
        except ObjectDoesNotExist:
            return None
    else:
        if session_cart_id:
            try:
                return Cart.objects.get(session_id=session_cart_id)
            except ObjectDoesNotExist:
                return None  # Avoid creating a cart unnecessarily

    return None  # No cart found


def create_or_get_cart(request):
    """Creates a cart only when an item is being added."""
    cart = get_cart(request)

    if cart:
        return cart

    # Only create a cart when needed
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
    else:
        session_cart_id = request.COOKIES.get("cart_id", str(uuid.uuid4()))
        cart, _ = Cart.objects.get_or_create(session_id=session_cart_id)

    return cart

def transfer_cart_to_user(request, user):    
    session_id = request.COOKIES.get('cart_id')  # Get from cookies

    if not session_id:
        return  # No guest cart found

    try:
        guest_cart = Cart.objects.get(session_id=session_id, user=None)
    except Cart.DoesNotExist:
        return  # No cart associated with session_id

    # Check if the logged-in user already has a cart
    user_cart, created = Cart.objects.get_or_create(user=user, defaults={"session_id": None})

    # Move all items from guest cart to user's cart
    with transaction.atomic():
        for item in guest_cart.cart_items.all():
            cart_item, item_created = CartItem.objects.get_or_create(
                cart=user_cart,
                product=item.product,
                variant=item.variant,
                defaults={"quantity": item.quantity, "delivery_option": item.delivery_option}
            )

            if not item_created:
                cart_item.quantity += item.quantity  # Merge duplicate items
                cart_item.save()

        # Delete the guest cart after transferring items
        guest_cart.delete()
        
    return True

