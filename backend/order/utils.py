from django.http import JsonResponse
from django.db import transaction
from django.http import JsonResponse
from .models import Cart, CartItem

from uuid import uuid4


def get_or_create_cart(request):
    cart_id = request.COOKIES.get('cart_id')  # Retrieve cart_id from cookies
    cart = None

    if request.user.is_authenticated:
        # **Authenticated User:** Use user-specific cart
        cart, _ = Cart.objects.get_or_create(user=request.user)
        
        # Merge guest cart into user cart if cart_id exists
        if cart_id:
            guest_cart = Cart.objects.filter(session_id=cart_id).first()
            if guest_cart and guest_cart != cart:
                guest_cart.user = request.user  # Assign user to guest cart
                guest_cart.session_id = None  # Remove session association
                guest_cart.save()
    else:
        # **Guest User:** Use session_id
        cart, _ = Cart.objects.get_or_create(session_id=cart_id)
    
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

