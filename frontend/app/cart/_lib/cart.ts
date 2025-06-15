// lib/cart-utils.ts
import Cookies from 'js-cookie';

export interface CartItem {
  p: string | number;  // productId
  q: number;          // quantity
  v?: string | number; // variantId (optional)
}

export interface CartUpdateResult {
  is_in_cart: boolean;
  quantity: number;
  message: string;
}


export const updateGuestCart = (
  productId: string | number,
  change: number,
  variantId?: string | number
): CartUpdateResult => {
  const cart: CartItem[] = JSON.parse(Cookies.get('guest_cart') || '[]');

  const compareVariant = variantId ?? undefined;

  const itemIndex = cart.findIndex(item => 
    item.p == productId && 
    ('v' in item ? item.v : undefined) == compareVariant
  );

  let message = "";
  let is_in_cart = false;
  let quantity = 0;

  if (itemIndex !== -1) {
    const currentQuantity = cart[itemIndex].q;
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
      cart.splice(itemIndex, 1); // Remove from cart
      message = "Item removed from cart.";
      is_in_cart = false;
      quantity = 0;
    } else {
      cart[itemIndex].q = newQuantity;
      is_in_cart = true;
      quantity = newQuantity;
      message = change > 0 ? "Item quantity increased." : "Item quantity decreased.";
    }
  } else if (change > 0) {
    // Add new item
    const newItem: CartItem = { p: productId, q: change };
    if (compareVariant !== undefined) newItem.v = compareVariant;
    cart.push(newItem);
    is_in_cart = true;
    quantity = change;
    message = "Item added to cart.";
  } else {
    // Trying to decrement a non-existent item
    message = "Item not found in cart.";
  }

  Cookies.set('guest_cart', JSON.stringify(cart), {
    expires: 30,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });

  return {
    is_in_cart,
    quantity,
    message
  };
};


export const getGuestCartItem = (
  productId: string | number, 
  variantId?: string | number
): { quantity: number; is_in_cart: boolean } => {
  const cart: CartItem[] = JSON.parse(Cookies.get('guest_cart') || '[]');
  const compareVariant = variantId ?? undefined;
  
  const item = cart.find(item => 
    item.p == productId && 
    ('v' in item ? item.v : undefined) == compareVariant
  );

  return {
    quantity: item?.q || 0,
    is_in_cart: !!item
  };
};


interface DeleteResult {
  deleted: boolean;
  message: string;
}

/**
 * Deletes a specific item from the guest cart based on product and optional variant ID.
 */
export const deleteFromGuestCart = (
  productId: string | number,
  variantId?: string | number
): DeleteResult => {
  const cart: CartItem[] = JSON.parse(Cookies.get('guest_cart') || '[]');
  const compareVariant = variantId ?? undefined;

  const itemIndex = cart.findIndex(item =>
    item.p == productId &&
    ('v' in item ? item.v : undefined) == compareVariant
  );

  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1);
    Cookies.set('guest_cart', JSON.stringify(cart), {
      expires: 30,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return {
      deleted: true,
      message: 'Item deleted from cart.'
    };
  }

  return {
    deleted: false,
    message: 'Item not found in cart.'
  };
};