
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CustomerAccount = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  // Set form data from user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully");
  };
  
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Account Navigation */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="font-semibold text-lg mb-4">Account Settings</h2>
            <nav className="space-y-1">
              <a 
                href="#" 
                className="block px-4 py-2 rounded-md bg-primary text-white"
              >
                Profile Information
              </a>
              <a 
                href="/account/orders" 
                className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Order History
              </a>
              <a 
                href="#" 
                className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Shipping Addresses
              </a>
              <a 
                href="#" 
                className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Payment Methods
              </a>
              <button 
                onClick={logout} 
                className="block w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>
        
        {/* Profile Information */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="font-semibold text-lg mb-6">Profile Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                  />
                </div>
                <div className="pt-4">
                  <Button type="submit">Update Profile</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccount;
