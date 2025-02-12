
export default function HomeBanner({ banners }) {
    return (
        <div  className="intro-banners">
          {banners.map((banner, i) => (
            <div  key={i} className="banner mb-lg-1 mb-xl-2">
              <a href={banner.link || '#'}>
                <img src={`${banner.image}`} alt="Banner" />
              </a>
              <div className="banner-content">
                <h4 className="banner-subtitle d-lg-none d-xl-block">
                  <a href="#">Top Product</a>
                </h4>
                <h3 className="banner-title">
                  <a href="#">Edifier <br />Stereo Bluetooth</a>
                </h3>
                <a className="banner-link">
                  Shop Now<i className="icon-long-arrow-right"></i>
                </a>
              </div>
            </div>
          ))}
      </div>
    
    );
  }
  