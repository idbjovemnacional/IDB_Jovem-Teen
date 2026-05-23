import { Search, X } from "lucide-react";

export default function EventSearch({ value, onChange, onClear }) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/40 pointer-events-none"
      />
      <input
        id="event-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Pesquisar evento..."
        className="w-full bg-white border border-[#1E1E1E]/10 rounded-lg pl-9 pr-9 py-2.5 text-sm text-[#1E1E1E] placeholder:text-[#1E1E1E]/40 focus:outline-none focus:border-[#FF6D2C] transition-colors"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E1E1E]/40 hover:text-[#FF6D2C] transition-colors"
          aria-label="Limpar pesquisa"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
