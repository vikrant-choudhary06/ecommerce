import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  ShirtIcon,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { getFeatureImages } from "@/store/common-slice";

import { NikeIcon, AdidasIcon, PumaIcon, LeviIcon, ZaraIcon, HMIcon } from "@/components/common/brand-icons";

// No dummy data fallbacks - purely database driven
const dummyBanners = [];
const dummyProducts = [];

const categoriesWithIcon = [
  { id: "shirts", label: "Shirts", icon: ShirtIcon },
  { id: "pants", label: "Pants & Jeans", icon: ShoppingBag },
  { id: "outerwear", label: "Outerwear", icon: CloudLightning },
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
  const { productList } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

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
    const banners = featureImageList && featureImageList.length > 0 ? featureImageList : dummyBanners;
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

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

  const bannersToShow = featureImageList && featureImageList.length > 0 ? featureImageList : dummyBanners;

  // Add defensive check for currentSlide bounds
  const activeSlide = currentSlide % (bannersToShow.length || 1);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[60vh] md:h-[80vh] min-h-[400px] overflow-hidden bg-muted">
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
                index === activeSlide ? "w-8 bg-primary" : "w-1.5 bg-primary/20"
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
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-background/50 border-none hover:bg-background transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5 text-foreground" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % bannersToShow.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-background/50 border-none hover:bg-background transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5 text-foreground" />
        </Button>

      </div>

      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-background"
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-center tracking-tighter uppercase mb-2">
              Shop by Category
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {categoriesWithIcon.map((categoryItem, idx) => (
              <Card
                key={idx}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer border-none shadow-none group"
              >
                <CardContent className="flex flex-col items-center justify-center p-6 bg-muted rounded-xl group-hover:bg-muted/80 transition-colors">
                  <categoryItem.icon className="w-10 h-10 mb-4 text-foreground/80 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                  <span className="font-semibold uppercase tracking-widest text-xs text-muted-foreground group-hover:text-foreground transition-colors">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION DIVIDER */}
      <div className="w-full flex justify-center py-4 bg-background">
        <div className="w-1/3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-muted/20"
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-center tracking-tighter uppercase mb-2">
              Featured Brands
            </h2>
            <div className="w-20 h-0.5 bg-primary/30" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {brandsWithIcon.map((brandItem, idx) => (
              <Card
                key={idx}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer border-none shadow-none group bg-transparent"
              >
                <CardContent className="flex flex-col items-center justify-center p-6 border border-border rounded-xl group-hover:border-primary transition-colors">
                  <brandItem.icon className="w-10 h-10 mb-4 text-muted-foreground group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                  <span className="font-semibold uppercase tracking-widest text-xs text-muted-foreground group-hover:text-foreground transition-colors">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION DIVIDER WITH ICON */}
      <div className="relative w-full flex items-center justify-center py-12 bg-background">
        <div className="absolute w-full h-px bg-border/40" />
        <div className="relative bg-background px-6">
            <Sparkles className="w-5 h-5 text-primary/40" />
        </div>
      </div>

      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-background"
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-center tracking-tighter uppercase mb-2">
              New Arrivals
            </h2>
            <p className="text-muted-foreground text-xs uppercase tracking-[0.3em] font-bold">Curated for excellence</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {(productList && productList.length > 0
              ? productList
              : dummyProducts
            ).map((productItem) => (
              <ShoppingProductTile
                key={productItem._id}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
              />
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default ShoppingHome;
