import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { NAV_LINKS } from "./header.constants";

export default function NavLinks() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e, item) => {
    if (item.path.startsWith("/#")) {
      e.preventDefault();
      const sectionId = item.path.replace("/#", "");

      if (location.pathname === "/") {
        // Já está na Home — apenas rola
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        // Navega para Home e depois rola
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  };

  return (
    <nav className="flex items-center gap-3 shrink-0">
      {NAV_LINKS.map((item) => {
        const isHashLink = item.path.startsWith("/#");

        return (
          <NavLink
            key={item.path}
            to={isHashLink ? "/" : item.path}
            onClick={(e) => handleClick(e, item)}
            end={isHashLink}
          >
            {({ isActive }) => (
              <div
                className={`
                  h-[45px]
                  rounded-[10px]
                  px-4
                  flex
                  items-center
                  justify-center
                  group
                  transition-all
                  duration-300
                  ${
                    !isHashLink && isActive
                      ? "bg-[#FF6D2C]/10"
                      : "hover:bg-[#FF6D2C]"
                  }
                `}
              >
                <span
                  className={`
                    text-[15px]
                    font-medium
                    whitespace-nowrap
                    transition-all
                    duration-300
                    ${
                      !isHashLink && isActive
                        ? "text-[#FF6D2C]"
                        : "text-black group-hover:text-white"
                    }
                  `}
                >
                  {item.label}
                </span>
              </div>
            )}
          </NavLink>
        );
      })}

      <NavLink to="/login">
        <button
          className="
            w-[35px]
            h-[35px]
            rounded-full
            bg-[#FF6D2C]
            flex
            items-center
            justify-center
            hover:scale-110
            transition-all
            duration-300
          "
        >
          <User size={20} className="text-white" />
        </button>
      </NavLink>
    </nav>
  );
}