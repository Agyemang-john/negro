from django.urls import path,include
from . import views

urlpatterns = [
    path('add-to-cart/', views.AddToCartView.as_view(), name='add-to-cart'),
    path('quantity/', views.CartQuantityView.as_view(), name='quantity'),
    path('cart/', views.CartView.as_view(), name='cart'),
    path('remove-cart/', views.RemoveFromCartView.as_view(), name='remove-cart'),
    path('info/', views.NavInfo.as_view(), name='info'),
]