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


class ProductDetailAPIView(APIView):
    serializer_class = ProductSerializer

    def get(self, request, sku, slug):
        product = get_object_or_404(
            Product.objects.annotate(
                average_rating=Avg('reviews__rating'),
                review_count=Count('reviews')
            ),
            slug=slug,
            status='published',
            sku=sku
        )
       

        # Check if the user is following the vendor
        is_following = (
            request.user.is_authenticated and
            product.vendor.followers.filter(id=request.user.id).exists()
        )

        # Serialize images, related products, reviews, etc.
        p_images = ProductImageSerializer(product.p_images.all(), many=True, context={'request': request}).data
        related_products = Product.objects.filter(
            sub_category=product.sub_category, status="published"
        ).exclude(id=product.id)[:10]
        vendor_products = Product.objects.filter(
            vendor=product.vendor, status="published"
        ).exclude(id=product.id)[:10]
        reviews = ProductReview.objects.filter(product=product, status=True).order_by("-date")
        delivery_options = ProductDeliveryOption.objects.filter(product=product)

        # Variant data
        variant_data = {}
        if product.variant != "None":
            variant_id = request.GET.get('variantid', None)
            variant = Variants.objects.get(id=variant_id) if variant_id else Variants.objects.filter(product=product).first()
            variant_data = {
                'variant': VariantSerializer(variant, context={'request': request}).data,
                'variant_images': VariantImageSerializer(VariantImage.objects.filter(variant=variant), many=True, context={'request': request}).data,
                'colors': VariantSerializer(Variants.objects.filter(product=product, size=variant.size), many=True, context={'request': request}).data,
                'sizes': VariantSerializer(Variants.objects.raw('SELECT * FROM product_variants WHERE product_id=%s GROUP BY size_id', [product.id]), many=True, context={'request': request}).data,
            }

        # Serialize the product
        serialized_product = ProductSerializer(product, context={'request': request}).data

        # Prepare response
        response_data = {
            "product": serialized_product,
            "p_images": p_images,
            "related_products": ProductSerializer(related_products, many=True, context={'request': request}).data,
            "vendor_products": ProductSerializer(vendor_products, many=True, context={'request': request}).data,
            "reviews": ProductReviewSerializer(reviews, many=True, context={'request': request}).data,
            'average_rating': product.average_rating or 0,
            'review_count': product.review_count or 0,
            "variant_data": variant_data,
            'is_following': is_following,
            "delivery_options": ProductDeliveryOptionSerializer(delivery_options, many=True).data,
            # 'is_in_cart': is_in_cart,
            # 'cart_quantity': quantity,
        }

        # Cache and respond
        cache_key = f"product_detail_{slug}_{sku}"
        cache_timeout = 60 * 10  # 10 minutes
        cache.set(cache_key, response_data, timeout=cache_timeout)

        variant = None
        checking_product = get_object_or_404(Product, slug=slug)

        variant_id = request.GET.get('variantid')
        cart = get_cart(request)
        if variant_id:
            variant = Variants.objects.filter(id=variant_id, product=checking_product).first()
        elif Variants.objects.filter(product=checking_product).exists():
            variant = Variants.objects.filter(product=checking_product).first()

        # Check if product exists in the cart
        cart_item = CartItem.objects.filter(cart=cart, product=checking_product, variant=variant).first()
        
        is_in_cart = bool(cart_item)  # True if item exists
        quantity = cart_item.quantity if cart_item else 0

        response_data['is_in_cart'] = is_in_cart
        response_data['cart_quantity'] = quantity


        return Response(response_data, status=status.HTTP_200_OK)
 