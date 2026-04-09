import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircleIcon } from "lucide-react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiatePayment() {
    if (cartItems.length === 0) {
      toast({
        title: "Your bag is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: paymentMethod === "cod" ? "confirmed" : "pending",
      paymentMethod: paymentMethod,
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        if (paymentMethod === "cod") {
          setIsOrderPlaced(true);
          setTimeout(() => {
            navigate("/shop/payment-success");
          }, 2500);
        } else {
          setIsPaymemntStart(true);
        }
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative h-[400px] w-full overflow-hidden bg-zinc-100 flex items-center justify-center">
        {/* Keeping image but adding a dark overlay or fallback style if missing */}
        <img src={img} className="h-full w-full object-cover object-center absolute inset-0 mix-blend-multiply opacity-50" />
        <h1 className="relative z-10 text-5xl font-serif text-black uppercase tracking-widest font-bold">Checkout</h1>
      </div>
      <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 mb-24">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-serif font-bold uppercase tracking-tight border-b border-zinc-200 pb-4">Shipping Information</h2>
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </div>
          <div className="flex flex-col gap-6 bg-zinc-50 p-8 border border-zinc-200">
            <h2 className="text-2xl font-serif font-bold uppercase tracking-tight border-b border-zinc-200 pb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems && cartItems.items && cartItems.items.length > 0
                ? cartItems.items.map((item) => (
                    <UserCartItemsContent key={item.productId} cartItem={item} />
                  ))
                : <p className="text-zinc-500 text-center py-4">Your bag is empty.</p>}
            </div>
            
            
            <div className="mt-8 space-y-4 border-t border-zinc-200 pt-6">
              <div className="flex flex-col gap-3 mb-6">
                <span className="font-semibold uppercase tracking-wider text-sm text-zinc-600">Payment Method</span>
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-zinc-200 hover:border-black transition-colors">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="paypal" 
                    checked={paymentMethod === "paypal"} 
                    onChange={() => setPaymentMethod("paypal")} 
                    className="accent-black w-4 h-4"
                  />
                  <span>Online Payment (Paypal)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 border border-zinc-200 hover:border-black transition-colors">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod" 
                    checked={paymentMethod === "cod"} 
                    onChange={() => setPaymentMethod("cod")} 
                    className="accent-black w-4 h-4"
                  />
                  <span>Cash on Delivery (COD)</span>
                </label>
              </div>

              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold uppercase tracking-wider text-sm text-zinc-600">Subtotal</span>
                <span className="font-bold text-black">${totalCartAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6 w-full">
              <Button 
                onClick={handleInitiatePayment} 
                className="w-full bg-black text-white hover:bg-zinc-800 rounded-none uppercase tracking-widest py-6 text-sm"
              >
                {isPaymentStart
                  ? "Processing Paypal Transaction..."
                  : `Checkout with ${paymentMethod === "cod" ? "COD" : "Paypal"}`}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isOrderPlaced && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-4 animate-in zoom-in-50 duration-500 delay-150">
            <CheckCircleIcon className="w-24 h-24 text-green-500" strokeWidth={1.5} />
            <h2 className="text-3xl font-serif font-bold text-zinc-900 tracking-tight">Order Placed Successfully!</h2>
            <p className="text-zinc-500 text-lg">Redirecting you...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingCheckout;
