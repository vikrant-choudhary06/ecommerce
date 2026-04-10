import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  function handleDownloadInvoice() {
    const doc = new jsPDF();
    
    // Add branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("BRAND LIFE STORE", 14, 25);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Premium Apparel & Accessories", 14, 32);
    doc.text("www.brandlifestore.com", 14, 37);

    // Date and Invoice Number
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 140, 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Invoice No: #${orderDetails?._id.slice(-6).toUpperCase()}`, 140, 32);
    doc.text(`Date: ${orderDetails?.orderDate.split("T")[0]}`, 140, 37);

    doc.setDrawColor(230);
    doc.line(14, 45, 196, 45);

    // Bill To & Ship To
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 14, 55);
    doc.setFont("helvetica", "normal");
    doc.text(user.userName, 14, 62);
    doc.text(user.email || "", 14, 67);

    doc.setFont("helvetica", "bold");
    doc.text("SHIP TO:", 140, 55);
    doc.setFont("helvetica", "normal");
    doc.text(orderDetails?.addressInfo?.address, 140, 62);
    doc.text(`${orderDetails?.addressInfo?.city}, ${orderDetails?.addressInfo?.pincode}`, 140, 67);
    doc.text(`Phone: ${orderDetails?.addressInfo?.phone}`, 140, 72);

    // Table
    const tableData = orderDetails?.cartItems.map(item => [
      item.title,
      item.quantity,
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`
    ]);

    doc.autoTable({
      startY: 85,
      head: [['PRODUCT', 'QTY', 'PRICE', 'AMOUNT']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' }
      }
    });

    // Summary
    const finalY = doc.lastAutoTable.finalY + 15;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Payment Method:", 14, finalY);
    doc.text(orderDetails?.paymentMethod.toUpperCase(), 14, finalY + 7);
    
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`GRAND TOTAL: $${orderDetails?.totalAmount.toFixed(2)}`, 140, finalY + 5);

    // Footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    doc.text("Thank you for choosing Brand Life Store. If you have any questions about this invoice,", 14, 280);
    doc.text("please contact our support team at support@brandlife.com", 14, 285);

    doc.save(`BrandLife_Invoice_${orderDetails?._id.slice(-6)}.pdf`);
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <div className="flex items-center gap-2">
                <Label>{orderDetails?._id}</Label>
                <Button onClick={handleDownloadInvoice} variant="outline" size="icon" className="h-8 w-8 rounded-full border-primary/20 hover:bg-primary/10">
                    <FileDown className="h-4 w-4" />
                </Button>
            </div>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
          </div>
        
        {/* ORDER TRACKING BAR */}
        <div className="my-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tracking Timeline</h3>
          </div>
          <div className="relative flex justify-between items-center w-full mt-8 mb-12">
            {/* The Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0" />
            
            {/* Steps */}
            {[
              { id: "pending", label: "In Process" },
              { id: "shipped", label: "Shipped" },
              { id: "outForDelivery", label: "Out for Delivery" },
              { id: "delivered", label: "Delivered" }
            ].map((step, index, array) => {
              const statusOrder = ["pending", "confirmed", "shipped", "outForDelivery", "delivered"];
              // Map 'confirmed' to same level as 'pending' or slightly higher
              const currentStatus = orderDetails?.orderStatus;
              let currentIndex = statusOrder.indexOf(currentStatus);
              if(currentStatus === 'confirmed') currentIndex = 0; // Treatment as first step success
              
              const stepIndex = ["pending", "shipped", "outForDelivery", "delivered"].indexOf(step.id);
              const isCompleted = currentIndex >= ["pending", "shipped", "outForDelivery", "delivered"].indexOf(step.id);
              const isCurrent = currentStatus === step.id || (currentStatus === 'confirmed' && step.id === 'pending');

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      isCompleted 
                        ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg" 
                        : "bg-background border-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-[8px] font-bold">{index + 1}</span>
                    )}
                  </div>
                  <span className={`absolute -bottom-8 whitespace-nowrap text-[10px] font-bold uppercase tracking-tighter transition-colors duration-300 ${isCompleted ? "text-primary" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                  {isCurrent && (
                    <div className="absolute -top-6 animate-bounce">
                       <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li key={item.productId} className="flex items-center justify-between border-b border-border/10 py-2 last:border-0">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold uppercase tracking-widest">{item.title}</span>
                        {(item.color || item.size) && (
                           <span className="text-[9px] text-muted-foreground uppercase font-bold">
                              {item.color} {item.size ? `/ ${item.size}` : ""}
                           </span>
                        )}
                      </div>
                      <div className="flex gap-4 text-xs font-bold font-serif whitespace-nowrap">
                        <span>x{item.quantity}</span>
                        <span>${item.price}</span>
                      </div>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
