
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts, Order } from "@/contexts/ProductsContext";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatDate } from "@/lib/utils";

type OrderStatus = "pending" | "shipped" | "delivered";

const VendorOrders = () => {
  const { isAuthenticated, user, isVendor } = useAuth();
  const { getOrdersByVendor, updateOrderStatus } = useProducts();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  
  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (!isAuthenticated || !isVendor) {
      navigate("/login");
    }
  }, [isAuthenticated, isVendor, navigate]);
  
  if (!user) return null;
  
  const allOrders = getOrdersByVendor(user.id);
  
  // Filter orders based on selected status
  const filteredOrders = filter === "all" 
    ? allOrders 
    : allOrders.filter(order => order.status === filter);
  
  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };
  
  // Get vendor-specific items for an order
  const getVendorItems = (order: Order) => {
    return order.items.filter(item => item.vendorId === user.id);
  };
  
  // Calculate total for vendor items in an order
  const getVendorTotal = (order: Order) => {
    const vendorItems = getVendorItems(order);
    return vendorItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Orders Management</h1>
      
      {/* Status Filter */}
      <div className="mb-6">
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value as OrderStatus | "all")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Order Header */}
              <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-sm text-gray-500">Order #{order.id}</p>
                  <p className="font-medium">{formatDate(order.date)}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={
                      order.status === "delivered" 
                        ? "default" 
                        : order.status === "shipped" 
                          ? "secondary" 
                          : "outline"
                    }
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Order Details */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 mb-1">Customer</h3>
                    <p>{order.customerName}</p>
                    <p>{order.customerEmail}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 mb-1">Shipping Address</h3>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
                
                <Accordion type="single" collapsible>
                  <AccordionItem value="items">
                    <AccordionTrigger className="text-sm font-medium">
                      Order Items ({getVendorItems(order).length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getVendorItems(order).map((item) => (
                            <TableRow key={item.productId}>
                              <TableCell>{item.productName}</TableCell>
                              <TableCell>${item.price.toFixed(2)}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3} className="text-right font-medium">
                              Vendor Total
                            </TableCell>
                            <TableCell className="font-bold">
                              ${getVendorTotal(order).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No orders found</h2>
          <p className="text-gray-600">
            {filter !== "all" 
              ? `You have no orders with status: ${filter}` 
              : "You haven't received any orders yet"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
