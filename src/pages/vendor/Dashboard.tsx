
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Sample data for charts
const salesData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 1800 },
  { name: "Mar", total: 2200 },
  { name: "Apr", total: 2600 },
  { name: "May", total: 3200 },
  { name: "Jun", total: 3800 },
  { name: "Jul", total: 4200 },
];

const VendorDashboard = () => {
  const { isAuthenticated, user, isVendor } = useAuth();
  const { getProductsByVendor, getOrdersByVendor } = useProducts();
  const navigate = useNavigate();
  
  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (!isAuthenticated || !isVendor) {
      navigate("/login");
    }
  }, [isAuthenticated, isVendor, navigate]);
  
  if (!user) return null;
  
  const products = getProductsByVendor(user.id);
  const orders = getOrdersByVendor(user.id);
  
  // Calculate metrics
  const totalProducts = products.length;
  
  const totalRevenue = orders.reduce((sum, order) => {
    const vendorItems = order.items.filter(item => item.vendorId === user.id);
    const orderTotal = vendorItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    return sum + orderTotal;
  }, 0);
  
  const totalSales = orders.reduce((sum, order) => {
    const vendorItems = order.items.filter(item => item.vendorId === user.id);
    const itemCount = vendorItems.reduce((count, item) => count + item.quantity, 0);
    return sum + itemCount;
  }, 0);
  
  const pendingOrders = orders.filter(order => order.status === "pending").length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <Button asChild>
          <Link to="/vendor/products/new">+ Add New Product</Link>
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-gray-500 mt-1">
              Products in your inventory
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-gray-500 mt-1">
              Items sold
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-gray-500 mt-1">
              Orders awaiting processing
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Sales Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#0EA5E9"
                  fill="#0EA5E9"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Manage Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              Add, edit, or remove products from your inventory
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/vendor/products">View Products</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Process Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              Check and update the status of customer orders
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/vendor/orders">View Orders</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              Get insights on your sales and product performance
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/vendor/analytics">View Analytics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;
