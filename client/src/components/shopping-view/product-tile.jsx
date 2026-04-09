import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto border-none shadow-none group">
      <div 
        onClick={() => handleGetProductDetails(product?._id)}
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
            <Badge className="absolute top-3 left-3 bg-black hover:bg-zinc-800 text-white px-2 py-1 uppercase text-xs tracking-wider">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-0 text-center">
          <h2 className="text-xl font-serif font-bold mb-1 group-hover:text-zinc-600 transition-colors">{product?.title}</h2>
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
                product?.salePrice > 0 ? "line-through text-muted-foreground" : "text-black"
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
            className="w-full uppercase tracking-wide bg-black text-white hover:bg-zinc-800 transition-colors rounded-none"
          >
            Add to Bag
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
