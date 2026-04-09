import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  ShirtIcon,
  UmbrellaIcon,
  WatchIcon,
  ShoppingBag
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

import { NikeIcon, AdidasIcon, PumaIcon, LeviIcon, ZaraIcon, HMIcon } from "@/components/common/brand-icons";

import p1 from "../../assets/p1.png";
import p2 from "../../assets/p2.png";
import p3 from "../../assets/p3.png";
import p4 from "../../assets/p4.png";
const dummyBanners = [
  { image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=2000&q=80" },
  { image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=2000&q=80" },
  { image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=2000&q=80" },
];

const dummyProducts = [
  {
    _id: "dummy1",
    image: p1,
    title: "Signature Leather Jacket",
    category: "outerwear",
    brand: "nike",
    price: 299,
    salePrice: 199,
  },
  {
    _id: "dummy2",
    image: p2,
    title: "Classic Oxford Shirt",
    category: "shirts",
    brand: "zara",
    price: 80,
    salePrice: 65,
  },
  {
    _id: "dummy3",
    image: p3,
    title: "Luxe Leather Satchel",
    category: "accessories",
    brand: "puma",
    price: 150,
    salePrice: 120,
  },
  {
    _id: "dummy4",
    image: p4,
    title: "Urban Elite Sneakers",
    category: "footwear",
    brand: "adidas",
    price: 180,
    salePrice: 145,
  },
];

const categoriesWithIcon = [
  { id: "shirts", label: "Shirts", icon: ShirtIcon },
  { id: "pants", label: "Pants & Jeans", icon: ShoppingBag },
  { id: "outerwear", label: "Outerwear", icon: CloudLightning },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: NikeIcon },
  { id: "adidas", label: "Adidas", icon: AdidasIcon },
  { id: "puma", label: "Puma", icon: PumaIcon },
  { id: "levi", label: "Levi's", icon: LeviIcon },
  { id: "zara", label: "Zara", icon: ZaraIcon },
  { id: "h&m", label: "H&M", icon: HMIcon },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
    window.scrollTo(0, 0);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product added to bag",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const banners = dummyBanners;
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  const bannersToShow = dummyBanners;

  // Add defensive check for currentSlide bounds
  const activeSlide = currentSlide % (bannersToShow.length || 1);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[60vh] md:h-[80vh] min-h-[400px] overflow-hidden bg-zinc-100">
        {bannersToShow.map((slide, index) => (
          <div
            key={index}
            className={`${
              index === activeSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            } absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out`}
          >
            <img
              src={slide?.image}
              className="w-full h-full object-cover object-center"
              alt={`Banner ${index + 1}`}
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        ))}

        {/* Banner Navigation Bullets */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {bannersToShow.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                index === activeSlide ? "w-8 bg-black" : "w-1.5 bg-black/20"
              }`}
            />
          ))}
        </div>


        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + bannersToShow.length) % bannersToShow.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50 border-none hover:bg-white transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5 text-black" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % bannersToShow.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50 border-none hover:bg-white transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5 text-black" />
        </Button>

      </div>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-4xl font-serif font-bold text-center mb-16 tracking-tighter">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {categoriesWithIcon.map((categoryItem, idx) => (
              <Card
                key={idx}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer border-none shadow-none group"
              >
                <CardContent className="flex flex-col items-center justify-center p-6 bg-zinc-50 rounded-xl group-hover:bg-zinc-100 transition-colors">
                  <categoryItem.icon className="w-10 h-10 mb-4 text-zinc-800 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                  <span className="font-semibold uppercase tracking-widest text-xs text-zinc-600 group-hover:text-black transition-colors">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-4xl font-serif font-bold text-center mb-16 tracking-tighter">
            Featured Brands
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {brandsWithIcon.map((brandItem, idx) => (
              <Card
                key={idx}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer border-none shadow-none group bg-transparent"
              >
                <CardContent className="flex flex-col items-center justify-center p-6 border border-zinc-200 rounded-xl group-hover:border-black transition-colors">
                  <brandItem.icon className="w-10 h-10 mb-4 text-zinc-400 group-hover:text-black transition-colors" strokeWidth={1.5} />
                  <span className="font-semibold uppercase tracking-widest text-xs text-zinc-500 group-hover:text-black transition-colors">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-4xl font-serif font-bold text-center mb-16 tracking-tighter">
            New Arrivals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {(productList && productList.length > 0
              ? productList
              : dummyProducts
            ).map((productItem) => (
              <ShoppingProductTile
                key={productItem._id}
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
              />
            ))}
          </div>

        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
