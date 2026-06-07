export default function EmptyState({
  message = "Nenhum item encontrado.",
  icon = null,
  className = "",
}) {
  return (
    <div className={`bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center ${className}`}>
      {icon && <div className="flex justify-center mb-3">{icon}</div>}
      <p className="text-sm text-[#1E1E1E]/40">{message}</p>
    </div>
  );
}
