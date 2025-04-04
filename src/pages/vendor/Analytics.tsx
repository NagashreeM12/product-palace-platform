
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A66CFF'];

const VendorAnalytics = () => {
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
  
  // Sales by Product
  const salesByProduct = products.map(product => {
    const productSales = orders.reduce((total, order) => {
      const productOrderItems = order.items.filter(
        item => item.productId === product.id
      );
      return (
        total +
        productOrderItems.reduce((sum, item) => sum + item.quantity, 0)
      );
    }, 0);
    
    return {
      name: product.name,
      sales: productSales
    };
  }).sort((a, b) => b.sales - a.sales).slice(0, 5); // Top 5 products
  
  // Revenue by Category
  const categoryMap = new Map<string, number>();
  
  orders.forEach(order => {
    order.items.forEach(item => {
      if (item.vendorId === user.id) {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const category = product.category;
          const revenue = item.price * item.quantity;
          categoryMap.set(
            category,
            (categoryMap.get(category) || 0) + revenue
          );
        }
      }
    });
  });
  
  const revenueByCategory = Array.from(categoryMap.entries()).map(
    ([name, value]) => ({ name, value })
  );
  
  // Monthly Sales Data (Mocked)
  const monthlySalesData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
            <CardDescription>Products in your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
            <CardDescription>Orders processed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>Earnings from all sales</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              ${orders
                .reduce((total, order) => {
                  const vendorItems = order.items.filter(
                    item => item.vendorId === user.id
                  );
                  return (
                    total +
                    vendorItems.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    )
                  );
                }, 0)
                .toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#0EA5E9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>Distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>Best performing products by sales volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={salesByProduct}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ width: 150 }}
                  tickFormatter={(value) => value.length > 20 ? `${value.slice(0, 20)}...` : value}
                />
                <Tooltip />
                <Bar dataKey="sales" fill="#0EA5E9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorAnalytics;
