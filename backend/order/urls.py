from django.urls import path,include
from . import views
from product.views import *

app_name = "order"

urlpatterns = [
    path('add-to-cart/', views.AddToCartView.as_view(), name='add-to-cart'),
    path('quantity/', views.CartQuantityView.as_view(), name='quantity'),
]