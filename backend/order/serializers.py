from rest_framework import serializers
from order.models import Cart, CartItem
from product.models import *

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = '__all__'

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = '__all__'

class VariantSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    size = SizeSerializer()
    color = ColorSerializer()

    class Meta:
        model = Variants
        fields = '__all__'      

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    variant = VariantSerializer(required=False)
    item_total = serializers.SerializerMethodField()
    packaging_fee = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['product', 'variant', 'quantity', 'item_total', 'packaging_fee']
    
    def get_item_total(self, obj):
        return obj.amount
    
    def get_packaging_fee(self, obj):
        return obj.packaging_fee()

class CartSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = '__all__'
