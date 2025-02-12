import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="footer">
            <div
                className="cta bg-image bg-dark pt-4 pb-5 mb-0"
                style={{ backgroundImage: `url(/static/assetss/images/demos/demo-4/bg-5.jpg)` }}
            >
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-sm-10 col-md-8 col-lg-6">
                            <div className="cta-heading text-center">
                                <h3 className="cta-title text-white">Get The Latest Deals</h3>
                                <p className="cta-desc text-white">
                                    and receive <span className="font-weight-normal">$20 coupon</span> for first shopping
                                </p>
                            </div>

                            <div className="subscribe__form">
                                <form action="#">
                                    <input type="email" placeholder="Enter your email here..." />
                                    <button>subscribe</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-middle d-dark-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6 col-lg-3">
                            <div className="widget widget-about">
                                <img
                                    src=""
                                    className="footer-logo"
                                    alt="Footer Logo"
                                    width="105"
                                    height="25"
                                />
                                <p>
                                    Praesent dapibus, neque id cursus ucibus, tortor neque egestas augue, eu vulputate magna
                                    eros eu erat.
                                </p>

                                <div className="widget-call">
                                    <i className="icon-phone"></i>
                                    Got Question? Call us 24/7
                                    <a href="#">+0123 456 789</a>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <div className="widget">
                                <h4 className="widget-title">Useful Links</h4>

                                <ul className="widget-list">
                                    <li><Link href="/about" prefetch={false}>About Us</Link></li>
                                    <li><a href="#">Our Services</a></li>
                                    <li><a href="#">How to shop on Molla</a></li>
                                    <li><a href="#">FAQ</a></li>
                                    <li><a href="#">Contact us</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <div className="widget">
                                <h4 className="widget-title">Customer Service</h4>

                                <ul className="widget-list">
                                    <li><a href="#">Payment Methods</a></li>
                                    <li><a href="#">Money-back guarantee!</a></li>
                                    <li><a href="#">Returns</a></li>
                                    <li><a href="#">Shipping</a></li>
                                    <li><a href="#">Terms and conditions</a></li>
                                    <li><a href="#">Privacy Policy</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <div className="widget">
                                <h4 className="widget-title">My Account</h4>

                                <ul className="widget-list">
                                    <li><a href="#">Sign In</a></li>
                                    <li><a href="#">View Cart</a></li>
                                    <li><a href="#">My Wishlist</a></li>
                                    <li><a href="#">Track My Order</a></li>
                                    <li><a href="#">Help</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p className="footer-copyright">
                        Copyright © 2025 NegroMart. All Rights Reserved.
                    </p>
                    <figure className="footer-payments">
                        <img
                            src=""
                            alt="Payment methods"
                            width="272"
                            height="20"
                        />
                    </figure>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
