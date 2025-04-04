
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, Product } from "@/contexts/ProductsContext";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Home = () => {
  const { products, categories, loading } = useProducts();
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get search and category from URL params
  const searchQuery = searchParams.get("search")?.toLowerCase();
  const categoryQuery = searchParams.get("category");

  useEffect(() => {
    // Set selected category from URL param
    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    } else {
      setSelectedCategory(null);
    }
  }, [categoryQuery]);

  useEffect(() => {
    // Filter products based on search and category
    let filtered = [...products];
    
    if (searchQuery) {
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery)
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory]);

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
    
    // Update URL parameters without causing full page reload
    const newParams = new URLSearchParams(searchParams);
    if (category === null) {
      newParams.delete("category");
    } else {
      newParams.set("category", category);
    }
    
    window.history.pushState({}, "", 
      window.location.pathname + "?" + newParams.toString()
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to ProductPalace</h1>
          <p className="text-xl mb-6">Discover quality products from trusted vendors all in one place</p>
          <Button size="lg" variant="secondary" onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}>
            Start Shopping
          </Button>
        </div>
      </section>

      {/* Category Filter */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Shop by Category</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => handleCategoryClick(null)}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
          </h2>
          {searchQuery && (
            <p className="text-gray-600">
              Search results for: <span className="font-medium">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter to find what you're looking for
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
