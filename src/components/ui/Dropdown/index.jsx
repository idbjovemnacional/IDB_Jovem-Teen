import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

/**
 * Componente genérico de dropdown com suporte a opções coloridas.
 *
 * @param {{
 *   value: string,
 *   onChange: (newValue: string) => void,
 *   options: Array<{ value: string, label: string }>,
 *   styles: Record<string, { bg: string, text: string, border: string, hoverBg: string, optionBg: string, optionHover: string, optionText: string }>,
 *   className?: string
 * }} props
 */
export default function Dropdown({ value, onChange, options, styles, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const currentStyle = styles[value] || Object.values(styles)[0];
  const currentLabel = options.find((o) => o.value === value)?.label || "";

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 6, left: rect.left });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        buttonRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      ) {
        return;
      }
      setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newValue) => {
    if (newValue !== value) {
      onChange(newValue);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Botão principal */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-bold
          border-2 ${currentStyle.border} ${currentStyle.bg} ${currentStyle.text}
          ${currentStyle.hoverBg}
          transition-all duration-200 cursor-pointer shadow-sm
          focus:outline-none focus:ring-2 focus:ring-offset-1
        `}
      >
        {currentLabel}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown options */}
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
            className="w-36 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-[1000] animate-fade-in overflow-hidden"
          >
            {options.map((option) => {
              const optStyle = styles[option.value];
              const isActive = option.value === value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full text-left px-3 py-2 text-sm font-semibold
                    transition-colors duration-150
                    ${isActive ? `${optStyle.optionBg} ${optStyle.optionText}` : `text-gray-600 ${optStyle.optionHover}`}
                  `}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${optStyle.bg}`} />
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}
