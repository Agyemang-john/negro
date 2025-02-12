"use client"


import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel as Slider } from 'react-responsive-carousel';
import Image from 'next/image';
// import '../styles/style.css';

export default function HomeCarousel({ sliders }) {

    const settings = {
        renderIndicator: false,
        infiniteLoop: true,
        autoPlay: true,
        showStatus: false,
        stopOnHover: true,
        swipeable: true, 
        interval: 10000, 
        showThumbs: false,
    };

    return (
        <>
        <Slider {...settings}>
            {sliders.map((s, i) => (
                <div key={i} className="intro-slide">
                    <figure className="slide-image">
                        <picture>
                        <source media="(max-width: 880px)" srcSet={`${s.image}`} />
                        <Image src={`${s.image}`} className="" alt="Image Desc" 
                            width={600}
                            height={400}
                        />
                        </picture>
                    </figure>

                    {/* Content overlay like text or buttons */}
                    <div className="intro-content">
                        <h3 className="intro-subtitle text-primary">Daily Deals</h3>
                        <h1 className="intro-title">
                        AirPods <br />Earphones
                        </h1>

                        <div className="intro-price">
                        <sup>Today:</sup>
                        <span className="text-primary">
                            $247<sup>.99</sup>
                        </span>
                        </div>

                        <a href="category.html" className="btn btn-primary btn-round">
                        <span>Click Here</span>
                        <i className="icon-long-arrow-right"></i>
                        </a>
                    </div>
                </div>
            ))}
        </Slider>
     </>
    )
}