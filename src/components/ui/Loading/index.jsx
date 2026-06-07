export default function Loading({ size = "md", message = "", className = "" }) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-14 h-14 border-4",
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-[#FF6D2C] border-t-transparent rounded-full animate-spin`}
      />
      {message && (
        <p className="mt-4 text-sm text-[#1E1E1E]/50 font-medium">{message}</p>
      )}
    </div>
  );
}
