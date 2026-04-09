import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { fetchProductDetails, setProductDetails } from "@/store/shop/products-slice";
import { Label } from "@/components/ui/label";
import StarRatingComponent from "@/components/common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useParams, useNavigate } from "react-router-dom";

function ShoppingProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { productDetails, isLoading } = useSelector((state) => state.shopProducts);

  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    return () => {
      dispatch(setProductDetails());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReviews(productDetails?._id));
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

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!productDetails) {
    return <div className="h-screen flex items-center justify-center">Product not found.</div>;
  }

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6 hover:bg-transparent"
      >
         &larr; Back to Shop
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div className="relative aspect-square md:aspect-auto h-[50vh] min-h-[500px] w-full overflow-hidden bg-zinc-50 dark:bg-zinc-900 rounded-lg shadow-sm">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight text-foreground">{productDetails?.title}</h1>
            <div className="flex items-center gap-3">
              <StarRatingComponent rating={averageReview} />
              <span className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
                ({reviews.length} Reviews)
              </span>
            </div>
          </div>

          <div className="mb-8 p-6 bg-muted border border-border italic font-serif text-lg leading-relaxed text-foreground rounded-md">
            {productDetails?.description}
          </div>

          <div className="flex items-baseline gap-4 mb-10">
            <span className={`text-3xl lg:text-4xl font-bold tracking-tighter ${productDetails?.salePrice > 0 ? "text-muted-foreground line-through" : "text-foreground"}`}>
              ${productDetails?.price}
            </span>
            {productDetails?.salePrice > 0 && (
              <span className="text-4xl lg:text-5xl font-bold tracking-tighter text-red-600 dark:text-red-400">
                ${productDetails?.salePrice}
              </span>
            )}
          </div>

          <div className="mb-12">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full h-14 bg-muted text-muted-foreground cursor-not-allowed rounded-none uppercase tracking-widest font-bold">
                Sold Out
              </Button>
            ) : (
              <Button
                className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none uppercase tracking-widest font-bold transition-all duration-300"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Bag
              </Button>
            )}
          </div>

          <Separator className="bg-border" />

          <div className="mt-12">
            <h2 className="text-3xl font-serif font-bold mb-8 uppercase tracking-tight text-foreground">Customer Reviews</h2>
            <div className="space-y-8 mb-12">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div key={reviewItem._id} className="flex gap-6 items-start">
                    <Avatar className="w-12 h-12 border border-border">
                      <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-foreground font-bold">
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">{reviewItem?.userName}</h3>
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-muted border border-dashed border-border rounded-lg text-muted-foreground font-serif">
                  No reviews yet. Be the first to share your experience.
                </div>
              )}
            </div>

            <div className="bg-muted/50 p-8 border border-border flex flex-col gap-6 rounded-md">
              <h3 className="text-xl font-serif font-bold uppercase tracking-tight text-foreground">Share your thoughts</h3>
              <div className="flex flex-col gap-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Rating</Label>
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <div className="flex flex-col gap-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Message</Label>
                <textarea
                  className="min-h-[120px] p-4 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary text-sm transition-all rounded-sm resize-y"
                  value={reviewMsg}
                  onChange={(event) => setReviewMsg(event.target.value)}
                  placeholder="Tell us what you think..."
                />
              </div>
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === "" || rating === 0}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none uppercase tracking-widest py-6 disabled:opacity-50"
              >
                Post Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingProductDetails;
