import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "@/store/shop/wishlist-slice";
import { useToast } from "../ui/use-toast";

function ShoppingProductTile({
  product,
  handleAddtoCart,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  function handleAddToWishlist(productId) {
    if (!user) {
      toast({
        title: "Please login to add to wishlist",
        variant: "destructive",
      });
      return;
    }
    dispatch(
      addToWishlist({
        userId: user?.id,
        productId,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Product added to wishlist",
        });
      } else {
        toast({
          title: data?.payload?.message || "Error occurred",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Card className="w-full max-w-sm mx-auto border-none shadow-none group bg-background">
      <div 
        onClick={() => navigate(`/shop/product/${product?._id}`)}
        className="cursor-pointer"
      >
        <div className="relative overflow-hidden mb-4 rounded-md">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[400px] object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 text-white px-2 py-1 uppercase text-xs tracking-wider">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 text-white px-2 py-1 uppercase text-xs tracking-wider">
              {`Low Stock`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-3 left-3 bg-primary hover:bg-primary/90 text-primary-foreground px-2 py-1 uppercase text-xs tracking-wider">
              Sale
            </Badge>
          ) : null}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToWishlist(product?._id);
            }}
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-secondary/80 backdrop-blur-md border border-border/50 hover:bg-white dark:hover:bg-zinc-800 text-red-500 transition-all z-10 rounded-full"
          >
            <Heart className="w-5 h-5 fill-red-500/10" />
          </Button>
        </div>
        <CardContent className="p-0 text-center">
          <h2 className="text-xl font-serif font-bold mb-1 group-hover:text-muted-foreground transition-colors">{product?.title}</h2>
          <div className="flex justify-center items-center mb-2 space-x-2">
            <span className="text-[14px] text-muted-foreground uppercase tracking-wider">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[14px] text-muted-foreground uppercase tracking-wider">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-center items-center mb-4 space-x-3">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through text-muted-foreground" : "text-foreground"
              } text-lg font-medium`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-medium text-red-600">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full uppercase tracking-wider opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full uppercase tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-none"
          >
            Add to Bag
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
