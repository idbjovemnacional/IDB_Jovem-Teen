import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, EyeOff, Eye } from "lucide-react";
import loginBg from "../../assets/images/login_background.png";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ usuario: "", senha: "" });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrar com API de autenticação
    navigate("/");
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay escuro sutil */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Card glassmorphism */}
      <form
        onSubmit={handleSubmit}
        className="
          relative z-10
          w-[90%] max-w-[480px]
          rounded-2xl
          border border-white/20
          px-10 py-12
          flex flex-col items-center gap-8
        "
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        {/* Título */}
        <h1 className="text-white font-bold text-2xl md:text-3xl tracking-tight">
          Faça o seu login
        </h1>

        {/* Campo Usuário */}
        <div className="w-full flex flex-col gap-2">
          <label className="text-white font-bold text-sm">Seu usuário:</label>
          <div className="flex items-center gap-3 bg-white/90 rounded-full px-5 h-[52px]">
            <User size={20} className="text-[#6B6B6B] shrink-0" />
            <input
              type="text"
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              className="flex-1 bg-transparent outline-none text-sm text-[#1E1E1E] placeholder:text-[#A0A0A0]"
              placeholder="Digite seu usuário"
            />
          </div>
        </div>

        {/* Campo Senha */}
        <div className="w-full flex flex-col gap-2">
          <label className="text-white font-bold text-sm">Sua senha:</label>
          <div className="flex items-center gap-3 bg-white/90 rounded-full px-5 h-[52px]">
            <Lock size={20} className="text-[#6B6B6B] shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              name="senha"
              value={form.senha}
              onChange={handleChange}
              className="flex-1 bg-transparent outline-none text-sm text-[#1E1E1E] placeholder:text-[#A0A0A0]"
              placeholder="Digite sua senha"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#6B6B6B] hover:text-[#1E1E1E] transition-colors shrink-0"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </div>

        {/* Botão Login */}
        <button
          type="submit"
          className="
            bg-white hover:bg-white/90
            text-[#FF6D2C] font-bold
            text-lg
            rounded-full
            px-12 py-3
            shadow-lg
            transition-all duration-300
            hover:shadow-xl hover:scale-[1.02]
          "
        >
          Login
        </button>
      </form>
    </main>
  );
}
