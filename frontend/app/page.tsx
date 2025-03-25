import HomeBanner from "../components/HomeBanner";
import HomeCarousel from "../components/HomeCarousel";
import HomeBrowsingHistory from "../components/productComponents/HomeBrowsingHistory";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import ProductCarousel from "@/components/productComponents/ProductCarousel";

// Fetch home data on the server
async function fetchHomeData() {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/index/`, {
			method: "GET",
			cache: "no-store", // Avoid caching for dynamic content
      		credentials: "include"
		});

		if (!res.ok) throw new Error("Failed to fetch home data");

		return await res.json();
	} catch (error) {
		console.error("Failed to fetch home data:", error);
		return null;
	}
}

// Home Component (Server Component)
export default async function Home() {
	const data = await fetchHomeData();

	if (!data) {
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
