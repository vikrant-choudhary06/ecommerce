import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { FileDown, Check, Circle, ShoppingBag } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  function handleDownloadInvoice() {
    const doc = new jsPDF();
    
    // Add branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("BRAND STORE", 14, 25);
    
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
      `INR ${Number(item.price).toFixed(2)}`,
      `INR ${(Number(item.price) * item.quantity).toFixed(2)}`
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
    doc.text(`GRAND TOTAL: INR ${Number(orderDetails?.totalAmount).toFixed(2)}`, 140, finalY + 5);

    // Footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    doc.text("Thank you for choosing Brand Store. If you have any questions about this invoice,", 14, 280);
    doc.text("please contact our support team at support@brandlife.com", 14, 285);

    doc.save(`BrandLife_Invoice_${orderDetails?._id.slice(-6)}.pdf`);
  }

  return (
    <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none bg-background/95 backdrop-blur-2xl">
      <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* HEADER SECTION - BOUTIQUE BLACK */}
        <div className="relative h-40 bg-[#09090b] flex items-end p-8 overflow-hidden border-b border-white/10">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <ShoppingBag size={180} className="text-white" />
            </div>
            <div className="flex justify-between items-end w-full relative z-10">
                <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/80">Digital Receipt</span>
                    <h2 className="text-4xl font-serif font-bold text-white italic tracking-tighter">Order Summary</h2>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold">Transaction Ref: #{orderDetails?._id.slice(-8).toUpperCase()}</p>
                </div>
                <Button 
                    onClick={handleDownloadInvoice} 
                    className="bg-white hover:bg-zinc-200 text-black rounded-none px-8 h-12 text-[10px] uppercase tracking-widest font-bold shadow-xl transition-all duration-300"
                >
                    <FileDown className="mr-2 h-4 w-4" />
                    Archive PDF
                </Button>
            </div>
        </div>

        <div className="p-8 space-y-12 bg-[#0c0c0e]">
            {/* QUICK INFO GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Purchased On', value: orderDetails?.orderDate.split("T")[0] },
                    { label: 'Amount Paid', value: `₹${Number(orderDetails?.totalAmount).toLocaleString()}` },
                    { label: 'Payment Method', value: orderDetails?.paymentMethod },
                    { label: 'Order Status', value: orderDetails?.orderStatus, isBadge: true },
                ].map((info, idx) => (
                    <div key={idx} className="space-y-1.5 p-5 bg-[#141417] border border-white/5">
                        <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-500 block">{info.label}</span>
                        {info.isBadge ? (
                            <div className="pt-1">
                                <Badge className={`rounded-none text-[9px] uppercase tracking-widest font-black px-3 py-1 ${
                                    orderDetails?.orderStatus === 'delivered' ? 'bg-blue-600' : 'bg-primary text-primary-foreground'
                                }`}>
                                    {info.value}
                                </Badge>
                            </div>
                        ) : (
                            <span className="text-sm font-bold text-zinc-200 uppercase tracking-tight">{info.value}</span>
                        )}
                    </div>
                ))}
            </div>

            {/* LIVE JOURNEY */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <span className="h-[1px] flex-1 bg-border" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">Tracking Timeline</h3>
                    <span className="h-[1px] flex-1 bg-border" />
                </div>
                
                <div className="relative flex justify-between items-center w-full px-4 pt-4">
                    <div className="absolute top-[13px] left-0 w-full h-[1px] bg-border z-0" />
                    {[
                        { id: "pending", label: "Processing" },
                        { id: "shipped", label: "Dispatched" },
                        { id: "outForDelivery", label: "Out For Delivery" },
                        { id: "delivered", label: "Delivered" }
                    ].map((step) => {
                        const statusOrder = ["pending", "confirmed", "shipped", "outForDelivery", "delivered"];
                        const currentStatus = orderDetails?.orderStatus;
                        let currentIndex = statusOrder.indexOf(currentStatus);
                        if(currentStatus === 'confirmed') currentIndex = 0; 
                        
                        const isCompleted = currentIndex >= statusOrder.indexOf(step.id === 'pending' ? 'pending' : step.id);
                        const isCurrent = currentStatus === step.id || (currentStatus === 'confirmed' && step.id === 'pending');

                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center group">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-700 ${
                                    isCompleted ? "bg-primary border-primary text-white shadow-xl scale-110" : "bg-background border-border text-muted-foreground"
                                }`}>
                                    {isCompleted ? <Check size={14} strokeWidth={3} /> : <Circle size={8} className="fill-current" />}
                                </div>
                                <span className={`absolute -bottom-8 whitespace-nowrap text-[9px] font-bold uppercase tracking-widest transition-all duration-500 ${
                                    isCompleted ? "text-primary opacity-100" : "text-muted-foreground opacity-40"
                                }`}>
                                    {step.label}
                                </span>
                                {isCurrent && (
                                    <div className="absolute -top-6">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ITEM LIST */}
            <div className="space-y-6 pt-8">
                <h3 className="text-xl font-serif font-bold italic tracking-tight border-b border-border pb-4">Acquired Items</h3>
                <div className="space-y-4">
                    {orderDetails?.cartItems?.map((item) => (
                        <div key={item.productId} className="flex items-center gap-6 group">
                            <div className="w-20 h-24 shrink-0 bg-muted overflow-hidden">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h4 className="text-sm font-bold uppercase tracking-widest leading-none">{item.title}</h4>
                                <div className="flex gap-2">
                                    {item.size && <span className="text-[10px] text-muted-foreground font-bold uppercase">Size: {item.size}</span>}
                                    {item.color && <span className="text-[10px] text-muted-foreground font-bold uppercase">Color: {item.color}</span>}
                                </div>
                                <div className="pt-2 flex items-center gap-4">
                                     <span className="text-[10px] font-bold py-1 px-2 bg-muted rounded">QTY: {item.quantity}</span>
                                     <span className="text-sm font-bold tracking-tight">₹{Number(item.price).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SHIPPING & NOTES */}
            <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-border/50">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-[.3em] text-muted-foreground">Shipping Destination</h4>
                    <div className="space-y-1">
                        <p className="text-sm font-bold">{user.userName}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {orderDetails?.addressInfo?.address}<br/>
                            {orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}<br/>
                            {orderDetails?.addressInfo?.phone}
                        </p>
                    </div>
                </div>
                {orderDetails?.addressInfo?.notes && (
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[.3em] text-muted-foreground">Order Memo</h4>
                        <div className="p-4 bg-muted/40 italic text-xs text-muted-foreground border-l-2 border-primary">
                            &quot;{orderDetails?.addressInfo?.notes}&quot;
                        </div>
                    </div>
                )}
            </div>

            {/* FINAL TOTAL */}
            <div className="pt-8 flex flex-col items-end gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[.4em] text-muted-foreground">Total Commitment</span>
                <div className="text-4xl font-serif font-bold italic tracking-tighter">
                    ₹{Number(orderDetails?.totalAmount).toLocaleString()}
                </div>
            </div>
        </div>
      </div>
    </DialogContent>
  );
}

ShoppingOrderDetailsView.propTypes = {
  orderDetails: PropTypes.shape({
    _id: PropTypes.string,
    orderDate: PropTypes.string,
    orderUpdateDate: PropTypes.string,
    totalAmount: PropTypes.number,
    paymentMethod: PropTypes.string,
    paymentStatus: PropTypes.string,
    orderStatus: PropTypes.string,
    trackingId: PropTypes.string,
    addressInfo: PropTypes.shape({
        address: PropTypes.string,
        city: PropTypes.string,
        pincode: PropTypes.string,
        phone: PropTypes.string,
        notes: PropTypes.string
    }),
    cartItems: PropTypes.arrayOf(PropTypes.shape({
        productId: PropTypes.string,
        title: PropTypes.string,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        quantity: PropTypes.number,
        color: PropTypes.string,
        size: PropTypes.string
    }))
  })
};

export default ShoppingOrderDetailsView;
