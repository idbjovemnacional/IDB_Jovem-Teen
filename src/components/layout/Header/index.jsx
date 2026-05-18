import { Link } from "react-router-dom";
import { Search, XCircle, MapPin } from "lucide-react";
import NavLinks from "./NavLinks";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6">
      <div
        className="
          w-[100%]
          min-h-[82px]
          bg-white
          flex
          items-center
          justify-between
          px-12
          py-6
          shadow-md
        "
      >
        <Link
          to="/"
          className="
            pl-10
            font-logo
            text-primary
            text-[48px]
            leading-[18px]
            shrink-0
            transition-all
            duration-300
            hover:scale-105
          "
        >
          IDB Jovem
        </Link>

        <div
          className="
            flex
            items-center
            gap-6
            flex-1
            max-w-[650px]
            mx-10
            mr-6
          "
        >
          <div
            className="
              flex-1
              min-w-[280px]
              max-w-[395px]
              h-[45px]
              rounded-[10px]
              border
              border-[#E0E0E0]
              bg-[#F2F2F2]/95
              shadow-search
              flex
              items-center
              px-5
              gap-4
            "
          >
            <Search size={20} className="text-primary" />

            <input
              type="text"
              placeholder="Pesquisar eventos..."
              className="
                flex-1
                bg-transparent
                outline-none
                text-sm
                font-medium
                placeholder:text-[#A0A0A0]
              "
            />

            <XCircle
              size={24}
              className="
                text-primary
                cursor-pointer
                hover:scale-110
                transition-all
              "
            />
          </div>

          <button
            className="
              w-[173px]
              h-[45px]
              rounded-[10px]
              border
              border-primary/20
              flex
              items-center
              justify-center
              gap-2
              hover:bg-primary
              group
              transition-all
              duration-300
            "
          >
            <span
              className="
                text-primary
                text-[14px]
                font-bold
                group-hover:text-white
                transition-all
              "
            >
              Eventos próximos
            </span>

            <MapPin
              size={21}
              className="
                text-primary
                group-hover:text-white
                transition-all
              "
            />
          </button>
        </div>

        <div className="pr-10">
            <NavLinks />
        </div>
      </div>
    </header>
  );
}