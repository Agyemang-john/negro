import uuid
from django.http import JsonResponse
from django.db import transaction
import uuid
from django.http import JsonResponse
from .models import Cart, CartItem

def get_or_create_cart(request):
    """Returns the user's cart if authenticated, otherwise creates/returns a guest cart via a cart_id cookie."""
    
    # **Authenticated User:** Return the user's cart
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user, session_id=None)
        return cart  # No response modification needed
    else:
        session_cart_id = request.COOKIES.get('cart_id')
        # Retrieve or create a cart for the guest user based on `session_id`
        cart, _ = Cart.objects.get_or_create(session_id=session_cart_id, user=None)

        return cart
  # Return both the cart instance and the response

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

