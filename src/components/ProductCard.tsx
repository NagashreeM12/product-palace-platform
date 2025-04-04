
import { useNavigate } from "react-router-dom";
import { Product } from "@/contexts/ProductsContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, ImageOff } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the button
    addToCart(product, 1);
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card 
      className={cn("h-full overflow-hidden transition-shadow hover:shadow-md cursor-pointer", className)}
      onClick={handleClick}
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        {!imageError ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
            onError={handleImageError}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            <ImageOff className="h-12 w-12" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-base line-clamp-2">{product.name}</h3>
          <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2 mb-2">{product.description}</p>
        <div className="flex items-center text-sm text-gray-600">
          <div className="flex items-center text-yellow-500">
            <Star className="fill-current h-4 w-4 mr-1" />
            <span className="font-medium">{product.rating}</span>
          </div>
          <span className="mx-2">•</span>
          <span>{product.reviews} reviews</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button 
          className="w-full"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
