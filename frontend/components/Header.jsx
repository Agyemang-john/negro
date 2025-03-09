"use client"

import Image from "next/image";
import { useEffect, useState } from 'react';
import Link from 'next/link'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
// import { getCartQuantity, addToCart, removeFromCart } from '@/lib/cart';
import Grid from '@mui/material/Grid';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useLogoutMutation } from '@/redux/features/authApiSlice';
import { logout as setLogout } from '@/redux/features/authSlice';
import { useGetCartQuery } from '@/redux/productApi/cartApiSlice';



function Header() {
    const { data: cart, isLoading } = useGetCartQuery();
    const [cartCount, setCartCount] = useState(0);

    const dispatch = useAppDispatch();

	const [logout] = useLogoutMutation();

	const { isAuthenticated } = useAppSelector(state => state.auth);

	const handleLogout = () => {
		logout(undefined)
			.unwrap()
			.then(() => {
				dispatch(setLogout());
			});
	};

    return (

        <header className="header header-intro-clearance header-4">
            <div className="header-top">
                <div className="container">
                    <div className="header-left">
                        {/* <ReverseGeocodeLocation /> */}
                    </div>

                    <div className="header-right">
                        <ul className="top-menu">
                            <li>
                                <a href="#">Links</a>
                                <ul>
                                    <li>
                                        <div className="header-dropdown">
                                            <select
                                                style={{ border: 'none', backgroundColor: '#fff' }}
                                                id="currency-select"
                                               
                                            >
                                                <option value="GHS">GHS</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                                {/* Add more options for other currencies as needed */}
                                            </select>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="header-dropdown">
                                            <a href="#" >English</a>
                                        </div>
                                    </li>
                                    
                                    <li>
                                        {isAuthenticated ? (
                                            <>
                                                <a className="cursor-pointer" onClick={handleLogout} >Logout</a>
                                            </>

                                        ):(
                                        <>
                                            <Link href="/register">Sign in / Sign up</Link>
                                        </>
                                            )}
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="header-middle shadow-sm">
                <div className="container d-flex justify-content-between">
                    <div className="header-left">
                        <button className="mobile-menu-toggler">
                            <span className="sr-only">Toggle mobile menu</span>
                            <MenuIcon fontSize="med"/>
                        </button>

                        <Link href={'/'} className="logo">
                            <Image src="/logo.png" alt="Logo" width={210} height={70} layout="intrinsic"/>
                        </Link>
                    </div>

                    <div className="col-xl-5 col-lg-4 d-none d-lg-block">
                        <div className="header__search">
                            <form >
                                <div className="header__search-box">
                                    <input name="q" className="search-input search-input-2" placeholder="I'm shopping for..." />
                                    <button type="submit" className="button button-2 button-3"><SearchIcon fontSize="large"/></button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="header-right">
                        <div className="dropdown compare-dropdown">
                            <a href="#" className="dropdown-toggle d-lg-none" title="Search" aria-label="Compare Products">
                                <div className="icon">
                                    <SearchIcon fontSize=""/>
                                </div>
                                <p></p>
                            </a>
                        </div>

                        <div className="wishlist">
                            <Link href={'/'} title="Account">
                                <div className="icon">
                                    <PersonIcon fontSize="large"/>
                                    <span className="wishlist-count badge">3</span>
                                </div>
                                <p title="Dashboard">
                                    {isAuthenticated
                                        ? `Hello, `
                                        : 'Login!'}
                                </p>
                            </Link>
                        </div>

                        <div className="dropdown cart-dropdown">
                            <Link href={'/'} className="dropdown-toggle">
                                <div className="icon">
                                    <ShoppingCartIcon fontSize="large"/>
                                    <span id="cart_count" className="cart-count">
                                    {/* {cartCount} */}
                                    {isLoading ? '...' : cart?.quantity || 0}
                                    </span> {/* Replace with actual cart count */}
                                </div>
                                <p>Cart</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="header-bottom sticky-header">
                <div className="container">
                    <div className="header-left">
                        <div className="dropdown category-dropdown ">
                            <a href="#" className="dropdown-toggle" title="Browse Categories">
                                Browse Categories <i className="icon-angle-down"></i>
                            </a>

                            <div className="dropdown-menu ">
                                <nav className="side-nav">
                                    <ul className="menu-vertical sf-arrows">
                                        <li className="item-lead"><a href="#">Daily offers</a></li>
                                        <li className="item-lead"><a href="#">Gift Ideas</a></li>
                                        <li><a href="#">Beds</a></li>
                                        <li><a href="#">Lighting</a></li>
                                        <li><a href="#">Sofas & Sleeper sofas</a></li>
                                        <li><a href="#">Storage</a></li>
                                        <li><a href="#">Armchairs & Chaises</a></li>
                                        <li><a href="#">Decoration </a></li>
                                        <li><a href="#">Kitchen Cabinets</a></li>
                                        <li><a href="#">Coffee & Tables</a></li>
                                        <li><a href="#">Outdoor Furniture </a></li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="header-center">
                        <nav className="main-nav">
                            <ul className="menu sf-arrows">
                                <li className="megamenu-container active">
                                    <a to="/" className="sf-with-ul">Home</a>

                                    <div className="megamenu demo">
                                        {/* Your megamenu content */}
                                    </div>
                                </li>
                                <li>
                                    <a to="/shop" className="sf-with-ul">Shop</a>
                                    {/* Your Shop dropdown content */}
                                </li>
                                <li>
                                    <a to="/product" className="sf-with-ul">Product</a>
                                    {/* Your Product dropdown content */}
                                </li>
                                <li>
                                    <a to="/pages" className="sf-with-ul">Pages</a>
                                    {/* Your Pages dropdown content */}
                                </li>
                                <li>
                                    <a to="/blog" className="sf-with-ul">Blog</a>
                                    {/* Your Blog dropdown content */}
                                </li>
                                <li>
                                    <a to="/elements" className="sf-with-ul">Elements</a>
                                    {/* Your Elements dropdown content */}
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

        </header>

    );
}

export default Header;
