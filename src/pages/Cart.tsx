
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart, CartItem } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= item.product.stock) {
      updateQuantity(item.product.id, newQuantity);
    }
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim() === "") {
      toast.error("Please enter a coupon code");
      return;
    }
    
    // Mock coupon codes
    if (couponCode.toLowerCase() === "welcome10") {
      toast.success("Coupon applied: 10% discount");
    } else if (couponCode.toLowerCase() === "summer20") {
      toast.success("Coupon applied: 20% discount");
    } else {
      toast.error("Invalid coupon code");
    }
    
    setCouponCode("");
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to proceed to checkout");
      navigate("/login");
      return;
    }
    
    navigate("/checkout");
  };

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Button asChild size="lg">
          <Link to="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Cart Items ({items.length})</h2>
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex flex-col sm:flex-row gap-4 py-4 border-t first:border-t-0">
                    {/* Product Image */}
                    <div className="w-full sm:w-24 h-24 bg-gray-100 rounded overflow-hidden shrink-0">
                      <Link to={`/product/${item.product.id}`}>
                        <img 
                          src={item.product.images[0] || "/placeholder.svg"} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-grow">
                      <Link to={`/product/${item.product.id}`} className="text-lg font-medium hover:text-primary transition-colors">
                        {item.product.name}
                      </Link>
                      <p className="text-gray-500 text-sm mb-2">Sold by: {item.product.vendorName}</p>
                      <p className="font-semibold">${item.product.price.toFixed(2)}</p>
                    </div>
                    
                    {/* Quantity Control */}
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Item Total & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <span className="font-bold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemove(item.product.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>Free</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Coupon Code */}
            <div className="mt-6 mb-6">
              <h3 className="text-sm font-medium mb-2">Coupon Code</h3>
              <div className="flex">
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="rounded-r-none"
                />
                <Button 
                  onClick={handleApplyCoupon}
                  className="rounded-l-none"
                  variant="secondary"
                >
                  Apply
                </Button>
              </div>
            </div>
            
            {/* Checkout Button */}
            <Button onClick={handleCheckout} className="w-full" size="lg">
              Proceed to Checkout
            </Button>
            
            {/* Continue Shopping */}
            <div className="mt-4 text-center">
              <Link to="/" className="text-primary hover:underline text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
