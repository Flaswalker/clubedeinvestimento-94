import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="glass-panel mt-20 pt-16 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                B
              </div>
              <span className="font-bold text-xl tracking-tight">Clube de 
Investimento</span>
            </div>
            <p className="text-muted-foreground text-sm mt-4 mb-6">
              Transformando o futuro dos investimentos com soluções financeiras inovadoras e seguras.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center transition hover:bg-primary/20" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center transition hover:bg-primary/20" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center transition hover:bg-primary/20" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center transition hover:bg-primary/20" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4">Serviços</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition">
                  Investimentos
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition">
                  Consultoria Financeira
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition">
                  Empréstimos
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition">
                  Seguros
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition">
                  Equipe
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition">
                  Carreiras
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition">© 2025 invistaeganhe.com.br Todos os direitos reservados.</Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition">
                  Termos de Serviço
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-primary text-sm transition">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {currentYear} Banko. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;