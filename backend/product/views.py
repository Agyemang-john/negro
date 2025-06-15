from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from .models import *
from order.models import *
from .serializers import *
from django.db.models import Avg, Count
from datetime import datetime, timedelta
from django.contrib.auth import authenticate, login, logout
from django.db.models.query_utils import Q
from django.db import transaction
import random
from decimal import Decimal
from django.db.models import Sum
from userauths.authentication import CustomJWTAuthentication

from django.core.cache import cache

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from order.service import *
from order.utils import *


class AjaxColorAPIView(APIView):
    def post(self, request, *args, **kwargs):
        size_id = request.data.get('size')
        product_id = request.data.get('productid')
        
        # Fetch the product by ID
        product = get_object_or_404(Product, id=product_id)
        
        # Fetch variants based on product ID and size ID
        colors = Variants.objects.filter(product_id=product_id, size_id=size_id)

        # Serialize the product and variants data
        product_data = ProductSerializer(product, context={'request': request}).data
        colors_data = VariantSerializer(colors, many=True, context={'request': request}).data
        
        # Prepare the response data
        response_data = {
            'product': product_data,
            'colors': colors_data
        }
        
        # Return the JSON response
        return Response(response_data, status=status.HTTP_200_OK)


# class ProductDetailAPIView(APIView):
#     serializer_class = ProductSerializer

#     def get(self, request, sku, slug):
#         product = get_object_or_404(
#             Product.objects.annotate(
#                 average_rating=Avg('reviews__rating'),
#                 review_count=Count('reviews')
#             ),
#             slug=slug,
#             status='published',
#             sku=sku
#         )

 
#         # Serialize images, related products, reviews, etc.
#         p_images = ProductImageSerializer(product.p_images.all(), many=True, context={'request': request}).data
#         related_products = Product.objects.filter(
#             sub_category=product.sub_category, status="published"
#         ).exclude(id=product.id)[:10]
#         vendor_products = Product.objects.filter(
#             vendor=product.vendor, status="published"
#         ).exclude(id=product.id)[:10]
#         reviews = ProductReview.objects.filter(product=product, status=True).order_by("-date")
#         delivery_options = ProductDeliveryOption.objects.filter(product=product)

#         # Variant data
#         variant_data = {}
#         if product.variant != "None":
#             variant_id = request.GET.get('variantid', None)
#             variant = Variants.objects.get(id=variant_id) if variant_id else Variants.objects.filter(product_id=product.id).first()
#             variant_data = {
#                 'variant': VariantSerializer(variant, context={'request': request}).data,
#                 'variant_images': VariantImageSerializer(VariantImage.objects.filter(variant=variant), many=True, context={'request': request}).data,
#                 'colors': VariantSerializer(Variants.objects.filter(product=product, size=variant.size), many=True, context={'request': request}).data,
#                 'sizes': VariantSerializer(Variants.objects.raw('SELECT * FROM product_variants WHERE product_id=%s GROUP BY size_id', [product.id]), many=True, context={'request': request}).data,
#             }

#         # Serialize the product
#         serialized_product = ProductSerializer(product, context={'request': request}).data

#         # Prepare response
#         response_data = {
#             "product": serialized_product,
#             "p_images": p_images,
#             "related_products": ProductSerializer(related_products, many=True, context={'request': request}).data,
#             "vendor_products": ProductSerializer(vendor_products, many=True, context={'request': request}).data,
#             "reviews": ProductReviewSerializer(reviews, many=True, context={'request': request}).data,
#             'average_rating': product.average_rating or 0,
#             'review_count': product.review_count or 0,
#             "variant_data": variant_data,
#             'follower_count': product.vendor.followers.count(),
#             "delivery_options": ProductDeliveryOptionSerializer(delivery_options, many=True).data,
#         }

#         # Cache and respond
#         cache_key = f"product_detail_{slug}_{sku}"
#         cache_timeout = 60 * 15
#         cache.set(cache_key, response_data, timeout=cache_timeout)

#         return Response(response_data, status=status.HTTP_200_OK)

# class ProductDetailAPIView(APIView):
#     serializer_class = ProductSerializer

#     def get(self, request, sku, slug):
#         # Try to get cached response first (excluding cart data)
#         cache_key = f"product_detail_{slug}_{sku}"
#         cached_data = cache.get(cache_key)
        
#         if cached_data is None:
#             try:
#                 cached_data = self._build_product_data(request, sku, slug)
#                 # Cache for future requests (10 minutes)
#                 cache.set(cache_key, cached_data, timeout=60 * 10)
#             except Exception as e:
#                 return Response(
#                     {"error": "Failed to load product data", "detail": str(e)},
#                     status=status.HTTP_500_INTERNAL_SERVER_ERROR
#                 )

#         try:
#             # Always get fresh cart data
#             response_data = self._add_fresh_cart_data(request, slug, cached_data.copy())
#             return Response(response_data, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response(
#                 {"error": "Failed to load cart data", "detail": str(e)},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )

#     def _build_product_data(self, request, sku, slug):
#         """Build and return the cacheable product data (without cart info)."""
#         product = get_object_or_404(
#             Product.objects.annotate(
#                 average_rating=Avg('reviews__rating'),
#                 review_count=Count('reviews')
#             ),
#             slug=slug,
#             status='published',
#             sku=sku
#         )

#         # Check if the user is following the vendor
#         is_following = (
#             request.user.is_authenticated and
#             product.vendor.followers.filter(id=request.user.id).exists()
#         )
#         follower_count = product.vendor.followers.count()

#         # Serialize images, related products, reviews, etc.
#         p_images = ProductImageSerializer(
#             product.p_images.all(), 
#             many=True, 
#             context={'request': request}
#         ).data
        
#         related_products = Product.objects.filter(
#             sub_category=product.sub_category, 
#             status="published"
#         ).exclude(id=product.id)[:10]
        
#         vendor_products = Product.objects.filter(
#             vendor=product.vendor, 
#             status="published"
#         ).exclude(id=product.id)[:10]
        
#         reviews = ProductReview.objects.filter(
#             product=product, 
#             status=True
#         ).order_by("-date")
        
#         delivery_options = ProductDeliveryOption.objects.filter(product=product)

#         # Variant data - fixed distinct issue
#         variant_id = request.GET.get('variantid')
        
#         variant_data = {}
#         if product.variant != "None":
#             variant_id = request.GET.get('variantid', None)
#             variant = Variants.objects.get(id=variant_id) if variant_id else Variants.objects.filter(product_id=product.id).first()
#             variant_data = {
#                 'variant': VariantSerializer(variant, context={'request': request}).data,
#                 'variant_images': VariantImageSerializer(VariantImage.objects.filter(variant=variant), many=True, context={'request': request}).data,
#                 'colors': VariantSerializer(Variants.objects.filter(product=product, size=variant.size), many=True, context={'request': request}).data,
#                 'sizes': VariantSerializer(Variants.objects.raw('SELECT * FROM product_variants WHERE product_id=%s GROUP BY size_id', [product.id]), many=True, context={'request': request}).data,
#             }

#         return {
#             "product": ProductSerializer(product, context={'request': request}).data,
#             "p_images": p_images,
#             "related_products": ProductSerializer(
#                 related_products, 
#                 many=True, 
#                 context={'request': request}
#             ).data,
#             "vendor_products": ProductSerializer(
#                 vendor_products, 
#                 many=True, 
#                 context={'request': request}
#             ).data,
#             "reviews": ProductReviewSerializer(
#                 reviews, 
#                 many=True, 
#                 context={'request': request}
#             ).data,
#             'average_rating': product.average_rating or 0,
#             'review_count': product.review_count or 0,
#             "variant_data": variant_data,
#             'is_following': is_following,
#             'follower_count': follower_count,
#             "delivery_options": ProductDeliveryOptionSerializer(
#                 delivery_options, 
#                 many=True
#             ).data,
#         }

#     def _add_fresh_cart_data(self, request, slug, response_data):
#         """Add fresh cart data to the response."""
#         product = get_object_or_404(Product, slug=slug)
#         variant_id = request.GET.get('variantid')
#         cart = Cart.objects.get_for_request(request)
        
#         try:
#             variant = Variants.objects.get(id=variant_id)if variant_id else Variants.objects.filter(product=product).first()
#         except Variants.DoesNotExist:
#             variant = None

#         cart_item = CartItem.objects.filter(
#             cart=cart, 
#             product=product, 
#             variant=variant
#         ).first()

#         print(cart)
#         print(cart_item)
        
#         response_data.update({
#             'is_in_cart': bool(cart_item),
#             'cart_quantity': cart_item.quantity if cart_item else 0,
#             'cart_item_id': getattr(cart_item, 'id', None),
#         })
        
#         return response_data

# class ProductDetailAPIView(APIView):
#     serializer_class = ProductSerializer

#     def get(self, request, sku, slug):
#         """Main GET endpoint with comprehensive error handling"""
#         try:
#             product_data = self._build_product_data(request, sku, slug)
#             response_data = self._add_fresh_cart_data(request, slug, product_data)
#             return Response(response_data, status=status.HTTP_200_OK)
#         except Exception as e:
#             logger.error(f"Error in ProductDetailAPIView: {str(e)}", exc_info=True)
#             return Response(
#                 {"error": "Failed to load product data", "detail": str(e)},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )
    
#     def _build_product_data(self, request, sku, slug):
#         """Build and return the cacheable product data (without cart info)."""
#         product = get_object_or_404(
#             Product.objects.annotate(
#                 average_rating=Avg('reviews__rating'),
#                 review_count=Count('reviews')
#             ),
#             slug=slug,
#             status='published',
#             sku=sku
#         )

#         # Check if the user is following the vendor
#         is_following = (
#             request.user.is_authenticated and
#             product.vendor.followers.filter(id=request.user.id).exists()
#         )
#         follower_count = product.vendor.followers.count()

#         # Serialize images, related products, reviews, etc.
#         p_images = ProductImageSerializer(product.p_images.all(), many=True, context={'request': request}).data
        
#         related_products = Product.objects.filter(sub_category=product.sub_category, status="published").exclude(id=product.id)[:10]
        
#         vendor_products = Product.objects.filter(vendor=product.vendor, status="published").exclude(id=product.id)[:10]
        
#         reviews = ProductReview.objects.filter(product=product, status=True).order_by("-date")
        
#         delivery_options = ProductDeliveryOption.objects.filter(product=product)

#         # Variant data - fixed distinct issue
#         variant_id = request.GET.get('variantid')
        
#         variant_data = {}
#         if product.variant != "None":
#             variant = Variants.objects.get(id=variant_id) if variant_id else Variants.objects.filter(product_id=product.id).first()
#             variant_data = {
#                 'variant': VariantSerializer(variant, context={'request': request}).data,
#                 'variant_images': VariantImageSerializer(VariantImage.objects.filter(variant=variant), many=True, context={'request': request}).data,
#                 'colors': VariantSerializer(Variants.objects.filter(product=product, size=variant.size), many=True, context={'request': request}).data,
#                 'sizes': VariantSerializer(Variants.objects.raw('SELECT * FROM product_variants WHERE product_id=%s GROUP BY size_id', [product.id]), many=True, context={'request': request}).data,
#             }

#         return {
#             "product": ProductSerializer(product, context={'request': request}).data,
#             "p_images": p_images,
#             "related_products": ProductSerializer(related_products, many=True, context={'request': request}).data,
#             "vendor_products": ProductSerializer(vendor_products, many=True, context={'request': request}).data,
#             "reviews": ProductReviewSerializer(reviews, many=True, context={'request': request}).data,
#             'average_rating': product.average_rating or 0,
#             'review_count': product.review_count or 0,
#             "variant_data": variant_data,
#             'is_following': is_following,
#             'follower_count': follower_count,
#             "delivery_options": ProductDeliveryOptionSerializer(delivery_options, many=True).data,
#         }

#     def _parse_guest_cart(self, request):
#         """Parse guest cart from headers or request data."""
#         guest_cart = request.headers.get('X-Guest-Cart') or request.data.get('guest_cart', '[]') or request.COOKIES.get('guest_cart', '[]')
#         try:
#             return json.loads(guest_cart)
#         except (json.JSONDecodeError, TypeError):
#             return []

#     def _get_guest_cart_item(self, request, product_id, variant_id=None):
#         """Get cart item from guest cart."""
#         cart = self._parse_guest_cart(request)
        
#         # Convert all IDs to strings for consistent comparison
#         str_product_id = str(product_id)
#         str_variant_id = str(variant_id) if variant_id is not None else None
        
#         for item in cart:
#             try:
#                 # Convert item IDs to strings
#                 item_product_id = str(item.get('p'))
#                 item_variant_id = str(item.get('v')) if 'v' in item else None
                
#                 # Compare product IDs
#                 product_match = item_product_id == str_product_id
                
#                 # Compare variant IDs if needed
#                 variant_match = True
#                 if str_variant_id is not None:
#                     variant_match = item_variant_id == str_variant_id
                
#                 if product_match and variant_match:
#                     # Return with consistent field names
#                     return {
#                         'is_in_cart': True,
#                         'cart_quantity': int(item.get('q', 0)),  # Changed to cart_quantity
#                         'cart_item_id': None
#                     }
#             except (ValueError, AttributeError):
#                 continue
                
#         return {'is_in_cart': False, 'cart_quantity': 0, 'cart_item_id': None}

#     def _add_fresh_cart_data(self, request, slug, response_data):
#         """Add cart data with guaranteed consistent field names"""
#         try:
#             product = get_object_or_404(Product, slug=slug)
#             variant_id = request.GET.get('variantid')
            
#             variant = None
#             if product.variant != "None":
#                 variant = (Variants.objects.get(id=variant_id) if variant_id 
#                           else Variants.objects.filter(product=product).first())

#             cart_data = self._get_cart_data(request, product, variant)
#             logger.debug(f"Cart data before merge: {cart_data}")  # Debug log

#             print(cart_data)

#             # Standardized field names
#             response_data.update({
#                 'is_in_cart': cart_data['is_in_cart'],
#                 'cart_quantity': cart_data['cart_quantity'],
#                 'cart_item_id': cart_data['cart_item_id']
#             })

#             logger.debug(f"Final response cart data: {response_data}")  # Debug log
#             print(response_data)
#             return response_data
            
#         except Exception as e:
#             logger.error(f"Error adding cart data: {e}", exc_info=True)
#             return {
#                 **response_data,
#                 'is_in_cart': False,
#                 'cart_quantity': 0,
#                 'cart_item_id': None
#             }

#     def _get_cart_data(self, request, product, variant):
#         """Unified cart data fetcher"""
#         if request.user.is_authenticated:
#             try:
#                 cart = Cart.objects.get_for_request(request)
#                 cart_item = CartItem.objects.filter(
#                     cart=cart, 
#                     product=product, 
#                     variant=variant
#                 ).first()
                
#                 return {
#                     'is_in_cart': bool(cart_item),
#                     'cart_quantity': cart_item.quantity if cart_item else 0,
#                     'cart_item_id': getattr(cart_item, 'id', None)
#                 }
#             except Exception as e:
#                 logger.warning(f"Auth cart error: {e}")
#                 return self._get_empty_cart_data()
#         else:
#             return self._get_guest_cart_item(
#                 request, 
#                 product.id, 
#                 variant.id if variant else None
#             )

#     def _get_empty_cart_data(self):
#         """Consistent empty cart response"""
#         return {
#             'is_in_cart': False,
#             'cart_quantity': 0,
#             'cart_item_id': None
#         }
import logging

logger = logging.getLogger(__name__)

class ProductDetailAPIView(APIView):
    authentication_classes = [CustomJWTAuthentication]

    def get(self, request, sku, slug):
        try:
            # Fetch product with annotations
            product = get_object_or_404(
                Product.objects.annotate(
                    average_rating=Avg('reviews__rating'),
                    review_count=Count('reviews')
                ),
                slug=slug,
                status='published',
                sku=sku
            )

            is_following = (
                request.user.is_authenticated and
                product.vendor.followers.filter(id=request.user.id).exists()
            )
            follower_count = product.vendor.followers.count()

            # Serialize data
            p_images = ProductImageSerializer(product.p_images.all(), many=True, context={'request': request}).data
            related_products = Product.objects.filter(sub_category=product.sub_category, status="published").exclude(id=product.id)[:10]
            vendor_products = Product.objects.filter(vendor=product.vendor, status="published").exclude(id=product.id)[:10]
            reviews = ProductReview.objects.filter(product=product, status=True).order_by("-date")
            delivery_options = ProductDeliveryOption.objects.filter(product=product)

            # Variant handling
            variant_id = request.GET.get('variantid')
            variant_data = {}
            if product.variant != "None":
                variant = Variants.objects.get(id=variant_id) if variant_id else Variants.objects.filter(product=product).first()
                variant_data = {
                    'variant': VariantSerializer(variant, context={'request': request}).data,
                    'variant_images': VariantImageSerializer(VariantImage.objects.filter(variant=variant), many=True, context={'request': request}).data,
                    'colors': VariantSerializer(Variants.objects.filter(product=product, size=variant.size), many=True, context={'request': request}).data,
                    'sizes': VariantSerializer(Variants.objects.raw('SELECT * FROM product_variants WHERE product_id=%s GROUP BY size_id', [product.id]), many=True, context={'request': request}).data,
                }
            else:
                variant = None

            # Cart data
            cart_data = {
                'is_in_cart': False,
                'cart_quantity': 0,
                'cart_item_id': None
            }
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


            print("Authentication check:  ",request.auth)
            if request.auth:
                try:
                    cart = Cart.objects.get_for_request(request)
                    cart_item = CartItem.objects.filter(cart=cart, product=product, variant=variant).first()
                    cart_data = {
                        'is_in_cart': bool(cart_item),
                        'cart_quantity': cart_item.quantity if cart_item else 0,
                        'cart_item_id': getattr(cart_item, 'id', None)
                    }
                    print(cart_data)
                except Exception as e:
                    logger.warning(f"Authenticated cart error: {e}")
            else:
                guest_cart = (
                    request.headers.get('X-Guest-Cart') 
                )
                try:
                    guest_cart = json.loads(guest_cart) if guest_cart else []
                except (json.JSONDecodeError, TypeError):
                    guest_cart = []

                for item in guest_cart:
                    try:
                        pid_match = str(item.get('p')) == str(product.id)
                        vid_match = True
                        if variant:
                            vid_match = str(item.get('v')) == str(variant.id)
                        if pid_match and vid_match:
                            cart_data = {
                                'is_in_cart': True,
                                'cart_quantity': int(item.get('q', 0)),
                                'cart_item_id': None
                            }
                            print('from logic', cart_data)
                            break
                    except Exception:
                        continue
            print("stock_quantity check:  ", stock_quantity)
            if cart_data["cart_quantity"] >= stock_quantity and stock_quantity != 0:
                is_out_of_stock = True

            # Build response
            response_data = {
                "is_out_of_stock": is_out_of_stock,
                "is_in_cart": cart_data["is_in_cart"],
                "cart_quantity": cart_data["cart_quantity"],
                "cart_item_id": cart_data["cart_item_id"],
                "product": ProductSerializer(product, context={'request': request}).data,
                "p_images": p_images,
                "related_products": ProductSerializer(related_products, many=True, context={'request': request}).data,
                "vendor_products": ProductSerializer(vendor_products, many=True, context={'request': request}).data,
                "reviews": ProductReviewSerializer(reviews, many=True, context={'request': request}).data,
                'average_rating': product.average_rating or 0,
                'review_count': product.review_count or 0,
                "variant_data": variant_data,
                'is_following': is_following,
                'follower_count': follower_count,   
                "delivery_options": ProductDeliveryOptionSerializer(delivery_options, many=True).data,
            }

            response_data["available_stock"] = stock_quantity

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Product detail error: {str(e)}", exc_info=True)
            return Response(
                {"error": "Failed to load product data", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


from django.db.models import Avg, Count, Max, Min, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

class CategoryProductListView(APIView):
    def get(self, request, slug):
        category = Sub_Category.objects.filter(slug=slug).first()
        if not category:
            return Response({"detail": "Category not found"}, status=404)

        # Base query with annotations
        products = Product.objects.filter(
            status="published", sub_category=category
        ).select_related('vendor', 'brand').prefetch_related('variants', 'reviews').annotate(
            average_rating=Avg('reviews__rating'),
            review_count=Count('reviews')
        )

        # Store unfiltered price range
        original_price_range = products.aggregate(
            max_price=Max('price'), min_price=Min('price')
        )

        # Extract filter query params
        filters = Q()
        color_ids = request.GET.getlist('color')
        size_ids = request.GET.getlist('size')
        brand_ids = request.GET.getlist('brand')
        vendor_ids = request.GET.getlist('vendor')
        ratings = request.GET.getlist('rating')
        min_price = request.GET.get('from')
        max_price = request.GET.get('to')

        if color_ids:
            filters &= Q(variants__color__id__in=color_ids)
        if size_ids:
            filters &= Q(variants__size__id__in=size_ids)
        if brand_ids:
            filters &= Q(brand__id__in=brand_ids)
        if vendor_ids:
            filters &= Q(vendor__id__in=vendor_ids)
        if min_price:
            filters &= Q(price__gte=min_price)
        if max_price:
            filters &= Q(price__lte=max_price)
        if ratings:
            filters &= Q(average_rating__gte=min(map(int, ratings)))

        if filters:
            products = products.filter(filters).distinct()

        # Pagination
        paginator = PageNumberPagination()
        paginator.page_size = 12
        paginated_products = paginator.paginate_queryset(products, request)

        # Serialize
        serialized_products = ProductSerializer(paginated_products, many=True, context={'request': request}).data

        # Product variant/color details
        products_with_details = []
        for product in paginated_products:
            variants = Variants.objects.filter(product=product)
            product_data = {
                'product': ProductSerializer(product, context={'request': request}).data,
                'average_rating': product.average_rating or 0,
                'review_count': product.review_count or 0,
                'variants': VariantSerializer(variants, many=True).data,
                'colors': variants.values('color__name', 'color__code', 'sku').distinct(),
            }
            products_with_details.append(product_data)

        # Sidebar filter options with counts (facets)
        def annotate_with_count(queryset, related_name):
            return queryset.annotate(
                product_count=Count(f'{related_name}__product', filter=Q(**{f'{related_name}__product__sub_category': category}))
            ).distinct()

        sizes = annotate_with_count(Size.objects.all(), 'variants')
        colors = annotate_with_count(Color.objects.all(), 'variants')
        brands = annotate_with_count(Brand.objects.all(), 'product')
        vendors = annotate_with_count(Vendor.objects.all(), 'product')

        # Final response
        return Response({
            "category": SubCategorySerializer(category).data,
            "products": serialized_products,
            "products_with_details": products_with_details,
            "colors": ColorSerializer(colors, many=True).data,
            "sizes": SizeSerializer(sizes, many=True).data,
            "vendors": VendorSerializer(vendors, many=True).data,
            "brands": BrandSerializer(brands, many=True).data,
            "min_price": original_price_range['min_price'],
            "max_price": original_price_range['max_price'],
            "total": products.count(),
        })



class CartDataView(APIView):
    authentication_classes = [CustomJWTAuthentication]  # Ensure auth works

    def get(self, request, sku, slug):
        product = get_object_or_404(Product, slug=slug, sku=sku)
        variant_id = request.GET.get('variantid')

        is_following = (
            request.user.is_authenticated and
            product.vendor.followers.filter(id=request.user.id).exists()
        )
        
        try:
            variant = Variants.objects.get(id=variant_id) if variant_id else Variants.objects.filter(product=product).first()
        except Variants.DoesNotExist:
            variant = None

        cart = Cart.objects.get_for_request(request)
        cart_item = CartItem.objects.filter(cart=cart, product=product, variant=variant).first()

        return Response({
            'is_in_cart': bool(cart_item),
            'is_following': is_following,
            'cart_quantity': cart_item.quantity if cart_item else 0,
            'cart_item_id': cart_item.id if cart_item else None,
        }, status=status.HTTP_200_OK)
         

class RecentlyViewedProducts(APIView):
    def get(self, request):
        ids = request.GET.get("ids", "")
        id_list = [int(i) for i in ids.split(",") if i.isdigit()]
        products = Product.objects.filter(id__in=id_list)
        
        id_order = {id_: idx for idx, id_ in enumerate(id_list)}
        sorted_products = sorted(products, key=lambda p: id_order.get(p.id, 0))
        
        return Response(ProductSerializer(sorted_products, many=True, context={'request': request}).data)

 