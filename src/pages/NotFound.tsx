
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-32 px-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Página não encontrada</p>
          <p className="mb-8">A página que você tentou acessar não existe ou foi movida.</p>
          <Link to="/">
            <Button>Voltar para a Página Inicial</Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
