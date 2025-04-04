
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Upload } from "lucide-react";

const VendorProductForm = () => {
  const { isAuthenticated, user, isVendor } = useAuth();
  const { getProductById, addProduct, updateProduct, categories } = useProducts();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: ["/placeholder.svg"],
    rating: 0,
    reviews: 0
  });
  
  // Redirect if not authenticated or not a vendor
  useEffect(() => {
    if (!isAuthenticated || !isVendor) {
      navigate("/login");
    }
  }, [isAuthenticated, isVendor, navigate]);
  
  // Load product data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const product = getProductById(id);
      if (!product) {
        toast.error("Product not found");
        navigate("/vendor/products");
        return;
      }
      
      // Check if the product belongs to the current vendor
      if (user && product.vendorId !== user.id) {
        toast.error("You don't have permission to edit this product");
        navigate("/vendor/products");
        return;
      }
      
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        images: product.images,
        rating: product.rating,
        reviews: product.reviews
      });
    }
  }, [isEditMode, id, getProductById, navigate, user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    
    const stock = parseInt(formData.stock);
    if (isNaN(stock) || stock < 0) {
      toast.error("Please enter a valid stock quantity");
      return;
    }
    
    try {
      if (isEditMode && id) {
        // Update existing product
        const product = getProductById(id);
        if (!product) return;
        
        updateProduct({
          ...product,
          name: formData.name,
          description: formData.description,
          price: price,
          category: formData.category,
          stock: stock,
          images: formData.images
        });
        
        toast.success("Product updated successfully");
      } else {
        // Add new product
        addProduct({
          name: formData.name,
          description: formData.description,
          price: price,
          category: formData.category,
          stock: stock,
          images: formData.images,
          rating: 0,
          reviews: 0
        });
        
        toast.success("Product added successfully");
      }
      
      // Navigate back to products page
      navigate("/vendor/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("An error occurred while saving the product");
    }
  };
  
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/vendor/products")} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>
      
      <h1 className="text-3xl font-bold mb-8">
        {isEditMode ? "Edit Product" : "Add New Product"}
      </h1>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <Label htmlFor="name" className="text-base">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>
          
          {/* Product Description */}
          <div>
            <Label htmlFor="description" className="text-base">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              className="mt-1"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <Label htmlFor="price" className="text-base">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            
            {/* Stock */}
            <div>
              <Label htmlFor="stock" className="text-base">Stock Quantity</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
          </div>
          
          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-base">Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id="category" className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Image Upload (Placeholder) */}
          <div>
            <Label className="text-base">Product Images</Label>
            <div className="mt-1 border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-300" />
              <div className="mt-4">
                <Button type="button" variant="outline">
                  Select Images
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" size="lg">
              {isEditMode ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorProductForm;
