import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa6";

const footerLinks = [
  { label: "Eventos", path: "/eventos" },
  { label: "Galeria de fotos", path: "/galeria" },
  { label: "Produtos", path: "/#produtos" },
  { label: "Contato", path: "/#contato" },
];

const socialLinks = [
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com/idbjovem" },
  { icon: FaYoutube, label: "YouTube", href: "https://youtube.com/@idbjovem" },
  { icon: Mail, label: "Email", href: "mailto:contato@idbjovem.com" },
];

export default function Footer() {
  return (
    <footer id="contato" className="w-full bg-[#1E1E1E] text-white">
      {/* Conteúdo principal */}
      <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Logo e descrição */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="font-['Faster_One'] text-[#FF6D2C] text-[36px] leading-none inline-block hover:scale-105 transition-transform">
              IDB Jovem
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-[280px]">
              Um movimento de jovens feito para quem busca viver a fé de forma viva e com propósito.
            </p>
            {/* Redes sociais */}
            <div className="flex items-center gap-3 mt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange-500 flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon size={16} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              Links rápidos
            </h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-orange-500 transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              Contato
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2 text-white/60 text-sm">
                <MapPin size={16} className="mt-0.5 shrink-0 text-orange-500" />
                <span>São Paulo, SP — Brasil</span>
              </li>
              <li className="flex items-start gap-2 text-white/60 text-sm">
                <Mail size={16} className="mt-0.5 shrink-0 text-orange-500" />
                <a href="mailto:contato@idbjovem.com" className="hover:text-orange-500 transition-colors">
                  contato@idbjovem.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="w-full border-t border-white/10">
        <div className="w-full max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} IDB Jovem. Todos os direitos reservados.
          </p>
          <p className="text-white/30 text-xs">
            Feito com ❤️ para a glória de Deus
          </p>
        </div>
      </div>
    </footer>
  );
}
