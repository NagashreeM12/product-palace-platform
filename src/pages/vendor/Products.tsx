
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Search, Plus, ImageOff } from "lucide-react";

const VendorProducts = () => {
  const { isAuthenticated, user, isVendor } = useAuth();
  const { getProductsByVendor, deleteProduct } = useProducts();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (!isAuthenticated || !isVendor) {
      navigate("/login");
    }
  }, [isAuthenticated, isVendor, navigate]);
  
  if (!user) return null;
  
  const products = getProductsByVendor(user.id);
  
  // Filter products based on search
  const filteredProducts = search.trim() === ""
    ? products
    : products.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) || 
        product.category.toLowerCase().includes(search.toLowerCase())
      );
  
  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };
  
  const handleEditProduct = (id: string) => {
    navigate(`/vendor/products/edit/${id}`);
  };
  
  const getStockStatus = (stock: number) => {
    if (stock <= 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (stock < 10) return { label: "Low Stock", variant: "outline" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Button asChild>
          <Link to="/vendor/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            type="search" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Products Table */}
      {filteredProducts.length > 0 ? (
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                const hasImageError = imageErrors[product.id];
                
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded bg-gray-100 mr-3 flex-shrink-0">
                          {!hasImageError ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="h-full w-full object-cover rounded"
                              onError={() => handleImageError(product.id)}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ImageOff className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <span className="truncate">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
          <h2 className="text-xl font-medium text-gray-600 mb-2">No products found</h2>
          <p className="text-gray-500 mb-6">
            {search.trim() !== "" 
              ? "Try adjusting your search to find what you're looking for" 
              : "You haven't added any products yet"
            }
          </p>
          {search.trim() !== "" ? (
            <Button variant="outline" onClick={() => setSearch("")}>
              Clear Search
            </Button>
          ) : (
            <Button asChild>
              <Link to="/vendor/products/new">Add Your First Product</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
