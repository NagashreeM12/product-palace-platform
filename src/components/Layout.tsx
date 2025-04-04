
import { Outlet, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Store, Menu, X, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductsContext";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export function Layout() {
  const { user, isAuthenticated, logout, isVendor } = useAuth();
  const { totalItems } = useCart();
  const { categories } = useProducts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 bg-white border-b transition-shadow duration-200",
          scrolled ? "shadow-md" : ""
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary flex items-center">
            <Store className="mr-2" />
            ProductPalace
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <form onSubmit={handleSearch} className="relative w-64">
              <Input
                type="search" 
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-3 pr-10 py-2 rounded-full"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-4 h-4 text-gray-500" />
              </button>
            </form>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">Categories</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="bg-white w-48 z-50">
                {categories.map((category) => (
                  <DropdownMenuItem 
                    key={category}
                    onClick={() => navigate(`/?category=${encodeURIComponent(category)}`)}
                    className="cursor-pointer"
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* User actions */}
          <div className="flex items-center space-x-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white w-56 z-50">
                  <DropdownMenuLabel>Hi, {user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {isVendor ? (
                    <>
                      <DropdownMenuItem>
                        <Link to="/vendor/dashboard" className="w-full">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/vendor/products" className="w-full">My Products</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/vendor/orders" className="w-full">Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/vendor/analytics" className="w-full">Analytics</Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem>
                        <Link to="/account" className="w-full">My Account</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/account/orders" className="w-full">My Orders</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 space-y-4">
            <form onSubmit={handleSearch} className="flex">
              <Input
                type="search" 
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              <Button type="submit" variant="secondary" className="ml-2">
                <Search className="w-4 h-4" />
              </Button>
            </form>

            <div className="space-y-2">
              <p className="font-medium">Categories</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button 
                    key={category} 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigate(`/?category=${encodeURIComponent(category)}`);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About ProductPalace</h3>
              <p className="text-sm text-gray-600">
                A premier multi-vendor marketplace connecting quality vendors with discerning customers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/" className="hover:text-primary">Home</Link></li>
                {!isAuthenticated && (
                  <>
                    <li><Link to="/login" className="hover:text-primary">Login</Link></li>
                    <li><Link to="/register" className="hover:text-primary">Register</Link></li>
                  </>
                )}
                <li><Link to="/cart" className="hover:text-primary">Cart</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <address className="not-italic text-sm text-gray-600">
                <p>Email: support@productpalace.com</p>
                <p>Phone: (555) 123-4567</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ProductPalace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
