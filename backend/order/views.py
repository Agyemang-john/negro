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
from rest_framework.permissions import AllowAny  # Optional, depending on your auth setup
from .serializers import *
from product.utils import *
from userauths.models import User
from userauths.authentication import CustomJWTAuthentication



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
from product.serializers import ProductSerializer, VariantSerializer
from .cart_utils import get_authenticated_cart_response, get_guest_cart_response, calculate_packaging_fee

logger = logging.getLogger(__name__)



class AddToCartView(views.APIView):
    permission_classes = [IsAuthenticated]
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
        cart = Cart.objects.create_for_request(request)

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

        variant = Variants.objects.get(id=variant_id) if variant_id else Variants.objects.filter(product=product).first()
        is_out_of_stock = False
        stock_quantity = 0
        if product.variant == 'None':
            stock_quantity = product.total_quantity
            is_out_of_stock = stock_quantity < 1
        else:
            if variant:
                stock_quantity = variant.quantity
                is_out_of_stock = stock_quantity < 1
            else:
                # If the product uses variants but no variant is selected
                is_out_of_stock = True

        if cart_item.quantity >= stock_quantity and stock_quantity != 0:
                is_out_of_stock = True

        return Response({
            "message": message,
            "quantity": res_quantity,
            "is_in_cart": is_in_cart,
            "is_out_of_stock": is_out_of_stock,
        })


class RemoveFromCartView(views.APIView):
    def post(self, request):
        data = request.data

        # Validate required fields
        product_id = data.get("product_id")
        if not product_id:
            return Response(
                {"error": "product_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        variant_id = data.get("variant_id", None)

        try:
            # Get or create the cart (handles both authenticated and guest users)
            cart = Cart.objects.create_for_request(request)

            # Fetch the product
            product = get_object_or_404(Product, id=product_id)

            # Fetch variant (if applicable)
            variant = None
            if variant_id:
                variant = get_object_or_404(Variants, id=variant_id)
                # Verify variant belongs to product
                if variant.product != product:
                    return Response(
                        {"error": "Variant does not belong to product"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Find and remove the cart item
            cart_item = get_object_or_404(
                CartItem,
                cart=cart,
                product=product,
                variant=variant
            )
            cart_item.delete()

            # Prepare updated cart data for response
            cart_items = CartItem.objects.filter(cart=cart).select_related('product', 'variant')
            total_amount = sum(item.product.price * item.quantity for item in cart_items)
            packaging_fee = sum(item.product.packaging_fee * item.quantity for item in cart_items)

            response_data = {
                "success": True,
                "message": "Item removed from cart",
                "cart": {
                    "items_count": cart_items.count(),
                    "total_amount": total_amount,
                    "packaging_fee": packaging_fee,
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


##############################################################################################
#######################################     CART QUANTITY ####################################
##############################################################################################
class CartQuantityView(APIView):
    """Retrieve the total quantity of items in the user's cart or guest cart."""

    def get(self, request):
        try:
            if request.auth:  # Authenticated user
                cart = Cart.objects.get_for_request(request)
                total_quantity = cart.total_quantity if cart else 0

            else:  # Guest user
                guest_cart_header = request.headers.get('X-Guest-Cart')
                try:
                    guest_cart = json.loads(guest_cart_header) if guest_cart_header else []
                except (json.JSONDecodeError, TypeError):
                    guest_cart = []

                total_quantity = sum(int(item.get("q", 0)) for item in guest_cart)

            return Response({"quantity": total_quantity}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Cart quantity view error: {str(e)}", exc_info=True)
            return Response(
                {"detail": "Error retrieving cart quantity", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
##############################################################################################
#######################################     CART QUANTITY ####################################
##############################################################################################



##############################################################################################
#######################################     CART VIEW ########################################
##############################################################################################
class CartView(APIView):
    def get(self, request):
        try:
            if request.auth:
                return get_authenticated_cart_response(request)
            else:
                return get_guest_cart_response(request)

        except Exception as e:
            logger.error(f"Cart view error: {str(e)}", exc_info=True)
            return Response(
                {"detail": "Error loading cart", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

##############################################################################################
#######################################     CART VIEW ########################################
##############################################################################################

class NavInfo(APIView):

    def get(self, request):
        user = User.objects.filter(id=request.user.id).first()
        is_authenticated = request.user.is_authenticated

        # If user is authenticated, you can serialize more info
        if request.auth:  # Authenticated user
            cart = Cart.objects.get_for_request(request)
            total_quantity = cart.total_quantity if cart else 0

        else:  # Guest user
            guest_cart_header = request.headers.get('X-Guest-Cart')
            try:
                guest_cart = json.loads(guest_cart_header) if guest_cart_header else []
            except (json.JSONDecodeError, TypeError):
                guest_cart = []

            total_quantity = sum(int(item.get("q", 0)) for item in guest_cart)

        return Response({
            "isAuthenticated": is_authenticated,
            "name": user.first_name if is_authenticated else None,
            "cartQuantity": total_quantity,
        })
