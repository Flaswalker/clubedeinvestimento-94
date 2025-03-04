
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  
  useEffect(() => {
    // If already logged in, redirect to appropriate dashboard
    if (user) {
      navigate(user.isAdmin ? "/admin" : "/dashboard");
    }
  }, [user, navigate]);
  
  const handleSuccess = (email: string) => {
    setRegisteredEmail(email);
    navigate(`/verify?email=${encodeURIComponent(email)}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-32">
        <div className="w-full max-w-md">
          <AuthForm type="register" onSuccess={handleSuccess} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
