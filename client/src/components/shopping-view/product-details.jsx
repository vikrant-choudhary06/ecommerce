import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  function handleRatingChange(getRating) {
    console.log(getRating, "getRating");

    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

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

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
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

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  console.log(reviews, "reviews");

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-12 p-0 max-w-[95vw] sm:max-w-[85vw] lg:max-w-[1200px] overflow-hidden rounded-none border-none">
        <div className="relative aspect-square md:aspect-auto h-full overflow-hidden bg-zinc-50">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-4xl font-serif font-bold tracking-tight text-black">{productDetails?.title}</h1>
            <div className="flex items-center gap-3">
              <StarRatingComponent rating={averageReview} />
              <span className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
                ({reviews.length} Reviews)
              </span>
            </div>
          </div>

          <div className="mb-8 p-6 bg-zinc-50 border border-zinc-100 italic font-serif text-lg leading-relaxed text-zinc-700">
            {productDetails?.description}
          </div>

          <div className="flex items-baseline gap-4 mb-10">
            <span className={`text-3xl font-bold tracking-tighter ${productDetails?.salePrice > 0 ? "text-zinc-400 line-through" : "text-black"}`}>
              ${productDetails?.price}
            </span>
            {productDetails?.salePrice > 0 && (
              <span className="text-4xl font-bold tracking-tighter text-red-600">
                ${productDetails?.salePrice}
              </span>
            )}
          </div>

          <div className="mb-12">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full h-14 bg-zinc-300 text-zinc-500 cursor-not-allowed rounded-none uppercase tracking-widest font-bold">
                Sold Out
              </Button>
            ) : (
              <Button
                className="w-full h-14 bg-black text-white hover:bg-zinc-900 rounded-none uppercase tracking-widest font-bold transition-all duration-300"
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

          <Separator className="bg-zinc-200" />

          <div className="mt-12">
            <h2 className="text-2xl font-serif font-bold mb-8 uppercase tracking-tight">Customer Reviews</h2>
            <div className="space-y-8 mb-12">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div key={reviewItem._id} className="flex gap-6 items-start">
                    <Avatar className="w-12 h-12 border border-zinc-200">
                      <AvatarFallback className="bg-zinc-100 text-black font-bold">
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-sm uppercase tracking-wider">{reviewItem?.userName}</h3>
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-zinc-600 text-sm leading-relaxed">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-zinc-50 border border-dashed border-zinc-200 rounded-lg text-zinc-400 font-serif">
                  No reviews yet. Be the first to share your experience.
                </div>
              )}
            </div>

            <div className="bg-zinc-50 p-8 border border-zinc-100 flex flex-col gap-6">
              <h3 className="text-xl font-serif font-bold uppercase tracking-tight">Share your thoughts</h3>
              <div className="flex flex-col gap-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Your Rating</Label>
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <div className="flex flex-col gap-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Your Message</Label>
                <textarea
                  className="min-h-[120px] p-4 bg-white border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-black text-sm transition-all"
                  value={reviewMsg}
                  onChange={(event) => setReviewMsg(event.target.value)}
                  placeholder="Tell us what you think..."
                />
              </div>
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === "" || rating === 0}
                className="bg-black text-white hover:bg-zinc-900 rounded-none uppercase tracking-widest py-6"
              >
                Post Review
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;

