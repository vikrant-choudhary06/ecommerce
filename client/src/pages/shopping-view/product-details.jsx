import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { fetchProductDetails, setProductDetails, fetchRecommendedProducts } from "@/store/shop/products-slice";
import { Label } from "@/components/ui/label";
import StarRatingComponent from "@/components/common/star-rating";
import { useEffect, useState, useRef } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useParams, useNavigate } from "react-router-dom";
import ShoppingProductTile from "@/components/shopping-view/product-tile";

function ShoppingProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [activeImage, setActiveImage] = useState("");
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });
  const containerRef = useRef(null);
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { productDetails, isLoading, recommendedProducts } = useSelector((state) => state.shopProducts);

  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    window.scrollTo(0, 0);
    return () => {
      dispatch(setProductDetails());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (productDetails) {
      dispatch(getReviews(productDetails?._id));
      dispatch(fetchRecommendedProducts(productDetails?.category));
      setActiveImage(productDetails?.image);
    }
  }, [productDetails, dispatch]);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems?.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }
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
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  function handleMouseMove(e) {
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${activeImage})`,
      backgroundSize: `${width * 2}px ${height * 2}px`
    });
  }

  function handleMouseLeave() {
    setZoomStyle({ display: 'none' });
  }

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
    </div>;
  }

  if (!productDetails) {
    return <div className="h-screen flex items-center justify-center font-serif italic text-muted-foreground">Product not found.</div>;
  }

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  const otherImages = productDetails?.images || [];

  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-10 text-xs font-bold uppercase tracking-[0.2em] hover:bg-transparent hover:opacity-60 flex items-center gap-2"
        >
           &larr; Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 mb-32">
          {/* IMAGE GALLERY SECTION */}
          <div className="lg:col-span-1 flex lg:flex-col gap-4 order-2 lg:order-1 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
             {[productDetails?.image, ...otherImages].map((img, idx) => (
               <div 
                 key={idx}
                 onClick={() => setActiveImage(img)}
                 className={`relative w-20 h-20 lg:w-full aspect-square border cursor-pointer overflow-hidden transition-all duration-300 ${activeImage === img ? 'border-primary ring-1 ring-primary' : 'border-border/50 opacity-60 hover:opacity-100'}`}
               >
                 <img src={img} className="w-full h-full object-cover" alt={`view-${idx}`} />
               </div>
             ))}
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-[4/5] w-full overflow-hidden bg-muted/20 cursor-crosshair group rounded-sm shadow-sm"
            >
              <img
                src={activeImage}
                alt={productDetails?.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:opacity-0"
              />
              <div 
                className="absolute inset-0 pointer-events-none hidden group-hover:block transition-opacity duration-300"
                style={zoomStyle}
              />
            </div>
          </div>
          
          <div className="lg:col-span-5 flex flex-col order-3">
            <div className="mb-10 animate-in fade-in slide-in-from-right-4 duration-700">
              <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-bold mb-4 block underline decoration-primary/30 underline-offset-8">Premium Edition</span>
              <h1 className="text-4xl xl:text-5xl font-serif font-bold tracking-tighter text-foreground mb-6 leading-[1.1]">{productDetails?.title}</h1>
              <div className="flex items-center gap-4">
                <StarRatingComponent rating={averageReview} />
                <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest bg-muted px-2 py-1">
                  {reviews.length} Verified Reviews
                </span>
              </div>
            </div>

            <div className="mb-10 text-muted-foreground text-lg leading-relaxed font-serif italic border-l-2 border-primary/20 pl-6 py-2">
              {productDetails?.description}
            </div>

            <div className="flex items-baseline gap-6 mb-12">
              <span className={`text-2xl xl:text-3xl font-bold tracking-tighter ${productDetails?.salePrice > 0 ? "text-muted-foreground/50 line-through" : "text-foreground"}`}>
                ${productDetails?.price}
              </span>
              {productDetails?.salePrice > 0 && (
                <span className="text-4xl xl:text-5xl font-bold tracking-tighter text-red-600 dark:text-red-400">
                  ${productDetails?.salePrice}
                </span>
              )}
            </div>

            <div className="mb-12 space-y-4">
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full h-16 bg-muted text-muted-foreground cursor-not-allowed rounded-none uppercase tracking-[0.3em] text-[10px] font-bold">
                  Sold Out
                </Button>
              ) : (
                <Button
                  className="w-full h-16 bg-primary text-primary-foreground hover:bg-black transition-all duration-500 rounded-none uppercase tracking-[0.3em] text-[10px] font-bold shadow-lg"
                  onClick={() =>
                    handleAddToCart(
                      productDetails?._id,
                      productDetails?.totalStock
                    )
                  }
                >
                  Confirm Purchase / Add to Bag
                </Button>
              )}
              <p className="text-center text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Free standard shipping on all orders over $150</p>
            </div>

            <Separator className="bg-border/50 mb-12" />

            <div className="grid grid-cols-2 gap-8 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-primary" />
                Ethically Sourced
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-primary" />
                Handcrafted Quality
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-primary" />
                30-Day Returns
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-primary" />
                Organic Fabric
              </div>
            </div>
          </div>
        </div>

        {/* YOU MAY ALSO LIKE SECTION */}
        {recommendedProducts && recommendedProducts.length > 0 && (
          <div className="mb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <header className="flex flex-col items-center mb-16">
              <span className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold mb-4">Complete the Look</span>
              <h2 className="text-4xl font-serif font-bold tracking-tighter text-foreground text-center">You May Also Like</h2>
              <div className="w-12 h-0.5 bg-primary/20 mt-6" />
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommendedProducts.filter(item => item._id !== id).slice(0, 4).map((item) => (
                <ShoppingProductTile 
                  key={item._id} 
                  product={item} 
                  handleAddtoCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        )}

        <Separator className="bg-border/30 mb-24" />

        {/* REVIEWS SECTION */}
        <div className="lg:max-w-4xl mx-auto">
          <header className="flex flex-col items-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-foreground text-center mb-4 tracking-tighter uppercase">Client Journals</h2>
            <p className="text-muted-foreground text-center font-serif italic">Honest feedback from our Global Community</p>
          </header>
          
          <div className="space-y-12 mb-20 px-4">
            {reviews && reviews.length > 0 ? (
              reviews.map((reviewItem) => (
                <div key={reviewItem._id} className="flex flex-col md:flex-row gap-8 items-start p-8 rounded-xl bg-muted/10 border border-border/10">
                  <Avatar className="w-14 h-14 border border-border shadow-sm">
                    <AvatarFallback className="bg-background text-foreground font-bold italic">
                      {reviewItem?.userName[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-foreground">{reviewItem?.userName}</h3>
                      <StarRatingComponent rating={reviewItem?.reviewValue} />
                    </div>
                    <p className="text-muted-foreground text-base leading-relaxed font-serif">
                      "{reviewItem.reviewMessage}"
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-muted/5 border border-dashed border-border rounded-xl text-muted-foreground font-serif italic">
                Our journal is empty. Tell us about your journey with this piece.
              </div>
            )}
          </div>

          <div className="bg-primary/5 p-12 border border-primary/10 flex flex-col gap-10 rounded-2xl animate-in zoom-in-95 duration-700">
            <h3 className="text-2xl font-serif font-bold uppercase tracking-tight text-foreground text-center">Join the Conversation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-4 items-center">
                <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Service Rating</Label>
                <div className="p-4 bg-background/50 rounded-full shadow-inner">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Your Narrative</Label>
                <textarea
                  className="min-h-[150px] p-6 bg-background border-none focus:ring-1 focus:ring-primary/20 text-sm transition-all rounded-xl shadow-inner resize-none font-serif"
                  value={reviewMsg}
                  onChange={(event) => setReviewMsg(event.target.value)}
                  placeholder="Share your experience with us..."
                />
              </div>
            </div>
            <Button
              onClick={handleAddReview}
              disabled={reviewMsg.trim() === "" || rating === 0}
              className="bg-primary text-primary-foreground hover:bg-black transition-all duration-500 rounded-none uppercase tracking-[0.4em] text-[10px] py-8 w-full shadow-2xl disabled:opacity-30"
            >
              Post to Journal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingProductDetails;
