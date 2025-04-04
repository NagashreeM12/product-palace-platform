
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag } from "lucide-react";

const OrderSuccess = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If someone navigates directly to this page without placing an order, redirect them
    const hasPlacedOrder = sessionStorage.getItem('orderPlaced');
    if (!hasPlacedOrder) {
      navigate('/');
    } else {
      // Clear the flag after arriving here legitimately
      sessionStorage.removeItem('orderPlaced');
    }
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-lg">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle className="h-10 w-10" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Order Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. We've received your order and will process it right away.
        </p>
        
        <div className="space-y-4">
          {isAuthenticated && (
            <Button asChild variant="outline" className="w-full">
              <Link to="/account/orders">
                <ShoppingBag className="mr-2 h-4 w-4" />
                View My Orders
              </Link>
            </Button>
          )}
          
          <Button asChild className="w-full">
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
