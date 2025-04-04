
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "@/contexts/ProductsContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ShoppingCart, Star, Store } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  const product = getProductById(id || "");
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`Sorry, only ${product.stock} items available`);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src={product.images[0] || "/placeholder.svg"} 
            alt={product.name}
            className="w-full h-auto object-contain max-h-[500px]"
          />
        </div>
        
        {/* Product Details */}
        <div>
          <span className="text-sm text-primary font-medium">{product.category}</span>
          <h1 className="text-3xl font-bold mt-1 mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-500">
              <Star className="fill-current h-4 w-4 mr-1" />
              <span>{product.rating}</span>
            </div>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-gray-600">{product.reviews} reviews</span>
          </div>
          
          <div className="text-3xl font-bold mb-6">${product.price.toFixed(2)}</div>
          
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="flex items-center mb-2">
            <Store className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700">Sold by: {product.vendorName}</span>
          </div>
          
          <div className="mb-2 text-gray-700">
            <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
            </span>
          </div>
          
          <Separator className="my-6" />
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium mb-2">
              Quantity
            </label>
            <div className="flex w-32">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={handleQuantityChange}
                className="text-center mx-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <Button 
            size="lg"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full md:w-auto"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
