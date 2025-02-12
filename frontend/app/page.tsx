import React from "react";
import HomeBanner from "../components/HomeBanner";
import HomeCarousel from "../components/HomeCarousel";
import HomeBrowsingHistory from "../components/productComponents/HomeBrowsingHistory";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import api from "../utils/api";
import ProductCarousel from '../components/productComponents/ProductCarousel';

// Define types for API data
interface Slider {
  id: number;
  image: string;
  title: string;
}

interface Banner {
  id: number;
  image: string;
  link: string;
}

interface HomeData {
  sliders: Slider[];
  banners: Banner[];
}

// Fetch data using a server-side function
async function fetchHomeData(): Promise<HomeData> {
  try {
    const response = await api.get<HomeData>(`/api/index/`, {
      headers: {
        "Cache-Control": "no-store", // Avoid caching for dynamic content
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch home data:", error);
    throw new Error("Unable to fetch data.");
  }
}

// Home Component
export default async function Home() {
  let data: HomeData;

  try {
    data = await fetchHomeData();
  } catch (error) {
    return (
      <main className="container">
        <p>Failed to load data. Please try again later.</p>
      </main>
    );
  }

  const { sliders, banners } = data;

  return (
    <main className="container">
      <div className="intro-section pt-3 pb-3 mb-2">
        <div className="container">
          <div className="row">
            {/* Main Slider Carousel */}
            <div className="col-lg-8">
              <div className="intro-slider-container slider-container-ratio mb-3 mb-lg-0">
                <div className="intro-slider">
                  <HomeCarousel sliders={sliders} />
                </div>
              </div>
            </div>
            {/* End Main Slider Carousel */}

            {/* Left Sidebar */}
            <div className="col-lg-4 d-none d-md-block">
              <HomeBanner banners={banners} />
            </div>
            {/* End Left Sidebar */}
            <Divider />
          </div>

          <Grid container spacing={2}>
            <HomeBrowsingHistory />
          </Grid>


          <ProductCarousel />

        </div>
      </div>
    </main>
  );
}
