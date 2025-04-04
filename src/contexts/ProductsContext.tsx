
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "sonner";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  vendorId: string;
  vendorName: string;
  stock: number;
  rating: number;
  reviews: number;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    vendorId: string;
  }[];
  status: 'pending' | 'shipped' | 'delivered';
  totalAmount: number;
  date: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
};

type ProductsContextType = {
  products: Product[];
  orders: Order[];
  categories: string[];
  addProduct: (product: Omit<Product, 'id' | 'vendorId' | 'vendorName'>) => string;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByVendor: (vendorId: string) => Product[];
  createOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => string;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByVendor: (vendorId: string) => Order[];
  getOrdersByCustomer: (customerId: string) => Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  loading: boolean;
};

// Mock products
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation technology. Perfect for music lovers and professionals working from home.",
    price: 129.99,
    images: ["/placeholder.svg"],
    category: "Electronics",
    vendorId: "1",
    vendorName: "Tech Solutions Inc",
    stock: 25,
    rating: 4.5,
    reviews: 127
  },
  {
    id: "2",
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and eco-friendly t-shirt made from 100% organic cotton. Available in multiple colors and sizes.",
    price: 24.99,
    images: ["/placeholder.svg"],
    category: "Clothing",
    vendorId: "3",
    vendorName: "Green Apparel Co",
    stock: 150,
    rating: 4.2,
    reviews: 89
  },
  {
    id: "3",
    name: "Smart Fitness Watch",
    description: "Track your health and fitness goals with this advanced smartwatch. Features heart rate monitoring, sleep tracking, and exercise detection.",
    price: 199.99,
    images: ["/placeholder.svg"],
    category: "Electronics",
    vendorId: "1",
    vendorName: "Tech Solutions Inc",
    stock: 42,
    rating: 4.7,
    reviews: 203
  },
  {
    id: "4",
    name: "Artisanal Ceramic Coffee Mug",
    description: "Handcrafted ceramic mug made by local artisans. Each piece is unique and perfect for your morning coffee or tea.",
    price: 19.99,
    images: ["/placeholder.svg"],
    category: "Home & Kitchen",
    vendorId: "4",
    vendorName: "Artisan Crafts",
    stock: 75,
    rating: 4.8,
    reviews: 56
  },
  {
    id: "5",
    name: "Professional Chef's Knife",
    description: "High-carbon stainless steel chef's knife with ergonomic handle. Essential tool for professional chefs and home cooking enthusiasts.",
    price: 89.99,
    images: ["/placeholder.svg"],
    category: "Home & Kitchen",
    vendorId: "5",
    vendorName: "Culinary Essentials",
    stock: 30,
    rating: 4.9,
    reviews: 112
  },
  {
    id: "6",
    name: "Vintage Leather Backpack",
    description: "Stylish and durable leather backpack with multiple compartments. Perfect for work, school, or travel.",
    price: 79.99,
    images: ["/placeholder.svg"],
    category: "Accessories",
    vendorId: "6",
    vendorName: "Urban Outfitters",
    stock: 60,
    rating: 4.3,
    reviews: 78
  }
];

// Mock orders
const mockOrders: Order[] = [
  {
    id: "1",
    customerId: "2",
    customerName: "Customer User",
    customerEmail: "customer@example.com",
    items: [
      {
        productId: "1",
        productName: "Wireless Bluetooth Headphones",
        quantity: 1,
        price: 129.99,
        vendorId: "1"
      },
      {
        productId: "2",
        productName: "Organic Cotton T-Shirt",
        quantity: 2,
        price: 24.99,
        vendorId: "3"
      }
    ],
    status: "shipped",
    totalAmount: 179.97,
    date: "2023-03-15T10:30:00Z",
    shippingAddress: {
      street: "123 Main St",
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
      country: "USA"
    }
  },
  {
    id: "2",
    customerId: "2",
    customerName: "Customer User",
    customerEmail: "customer@example.com",
    items: [
      {
        productId: "3",
        productName: "Smart Fitness Watch",
        quantity: 1,
        price: 199.99,
        vendorId: "1"
      }
    ],
    status: "pending",
    totalAmount: 199.99,
    date: "2023-04-05T14:45:00Z",
    shippingAddress: {
      street: "123 Main St",
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
      country: "USA"
    }
  }
];

// Extract unique categories
const extractCategories = (products: Product[]): string[] => {
  const categorySet = new Set(products.map(p => p.category));
  return Array.from(categorySet);
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [categories, setCategories] = useState<string[]>(extractCategories(mockProducts));
  const [loading, setLoading] = useState(false);

  // Simulate API loading
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  // Update categories when products change
  useEffect(() => {
    setCategories(extractCategories(products));
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id' | 'vendorId' | 'vendorName'>) => {
    // Simulate authenticated user being the vendor
    const vendorId = "1"; // This would come from auth context in a real app
    const vendorName = "Tech Solutions Inc";
    
    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substring(2, 9),
      vendorId,
      vendorName
    };
    
    setProducts(prev => [...prev, newProduct]);
    toast.success(`Product "${newProduct.name}" added successfully`);
    return newProduct.id;
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    toast.success(`Product "${updatedProduct.name}" updated successfully`);
  };

  const deleteProduct = (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    if (productToDelete) {
      setProducts(prev => prev.filter(product => product.id !== id));
      toast.success(`Product "${productToDelete.name}" deleted successfully`);
    }
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getProductsByVendor = (vendorId: string) => {
    return products.filter(product => product.vendorId === vendorId);
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    setOrders(prev => [...prev, newOrder]);
    toast.success(`Order placed successfully!`);
    return newOrder.id;
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  const getOrdersByVendor = (vendorId: string) => {
    return orders.filter(order => 
      order.items.some(item => item.vendorId === vendorId)
    );
  };

  const getOrdersByCustomer = (customerId: string) => {
    return orders.filter(order => order.customerId === customerId);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
    toast.success(`Order status updated to ${status}`);
  };

  const value = {
    products,
    orders,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByVendor,
    createOrder,
    getOrderById,
    getOrdersByVendor,
    getOrdersByCustomer,
    updateOrderStatus,
    loading
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
