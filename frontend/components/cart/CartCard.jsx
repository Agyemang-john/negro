import React from 'react';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';

const CartCard = ({
  cartItems,
  totalAmount,
  packagingFee,
}) => {
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <main className="container">
      {cartItems && cartItems.length === 0 ? (
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="error-info text-center">
                <div className="error-content">
                  <h5>No Cart Item Found</h5>
                  <p>
                    Sorry, <strong>Dear Customer</strong>, your cart is empty. Please return to the
                    homepage.
                  </p>
                  <div className="error-button">
                    <Link href="/" className="error-btn">
                      Shop More!
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="cart_items" className="bg-light">
          <div className="row main-div">
            <div className="col-lg-8 col-md-8 collg8">
              {cartItems?.map((c, i) => (
                <section className="allData shadow-sm" key={i}>
                  <div id="cartdiv" className="main-section">
                    <div className="d-flex space-x-5 justify-content-between">
                      <div className="pb-0 mb-0 product-thumbnail">
                        <Link href="#" className="product-thumbnail">
                          {c.product.variant !== 'None' ? (
                            <img
                              className="product-thumbnail mn-200"
                              src={c.variant?.image}
                              width="100"
                              alt=""
                            />
                          ) : (
                            <img
                              className="product-thumbnail mn-200"
                              src={c.product.image}
                              width="100"
                              alt=""
                            />
                          )}
                        </Link>
                        <div className="align-items-center w-100">
                          <button
                            className="badge btn-block ml-15 px-2 py-2 shadow-sm shadow-sm border text-dark bg-light"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="w-100 vertical-container">
                        <div>
                          <h5 className="cart-item-title">
                            <Link href={`/${c.product.slug}/${c.product.id}/${c.product.sub_category.slug}`}>
                              {truncateText(c.product.title, 40)}
                            </Link>
                          </h5>
                          <p>
                            {c.variant ? (
                              <>
                                {c.variant.size ? <>Size: <span>{c.variant.size.name}</span></> : null}
                                {c.variant.size && c.variant.color ? ' | ' : ''}
                                {c.variant.color ? (
                                  <>Color: <span>{c.variant.color.name}</span></>
                                ) : null}
                              </>
                            ) : (
                              <>No variant available</>
                            )}
                          </p>
                        </div>

                        <div>
                          <div className="d-flex justify-content-between align-items-center">
                            <h4 className="product-price">
                              {!c.variant ? (
                                <span className="new-price">GHS {c.product?.price.toFixed(2)}</span>
                              ) : (
                                <span className="new-price">GHS {c.variant?.price.toFixed(2)}</span>
                              )}
                            </h4>
                          </div>

                          <div className="d-flex align-items-center justify-content-between">
                            <div></div>
                            <div className="input-counter">
                              <button
                                className="minus-button updateQuantity shadow-sm text-white"
                              >
                                -
                              </button>
                              <input
                                className="quantity_total_"
                                type="text"
                                min="1"
                                max="6"
                                value={c?.quantity}
                                readOnly
                              />
                              <button
                                className="plus-button updateQuantity shadow-sm text-white"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <Box className="col-lg-4 col-md-4" id="summary_card" sx={{ maxWidth: '100%', padding: '' }}>
              <Card sx={{ boxShadow: 1, borderRadius: '5px' }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{
                      textTransform: 'uppercase',
                      borderBottom: 1,
                      borderColor: 'grey.200',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 'bold',
                      pb: 1,
                    }}
                  >
                    <span>Cart Summary</span>
                  </Typography>

                  <Box sx={{ borderBottom: 1, borderColor: 'grey.300', my: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        Subtotal
                      </Typography>
                      <Typography variant="h4" id="summary_totalamount">
                        GHS {totalAmount?.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ borderBottom: 1, borderColor: 'grey.300', my: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        Packaging fee
                      </Typography>
                      <Typography variant="h4" id="packaging_fee">
                        GHS {packagingFee?.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    href="/order/checkout"
                  >
                    Proceed to Checkout
                  </Button>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
                    Free fast delivery. No order minimum. Exclusive savings. Start your 30-day free trial of
                    Prime.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </div>
        </div>
      )}
    </main>
  );
};

export default CartCard;