import { NavLink } from "react-router-dom";
import { User } from "lucide-react";
import { NAV_LINKS } from "./header.constants";

export default function NavLinks() {
  return (
    <nav className="flex items-center gap-3 shrink-0">
      {NAV_LINKS.map((item) => (
        <NavLink key={item.path} to={item.path}>
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
                  isActive
                    ? "bg-primary/10"
                    : "hover:bg-primary"
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
                    isActive
                      ? "text-primary"
                      : "text-black group-hover:text-white"
                  }
                `}
              >
                {item.label}
              </span>
            </div>
          )}
        </NavLink>
      ))}

      <button
        className="
          w-[35px]
          h-[35px]
          rounded-full
          bg-primary
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
    </nav>
  );
}