import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  className?: string;
};

const variantStyles = {
  default: "bg-[#151515] text-[#a1a1a1] border-[#2a2a2a]",
  success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  error: "bg-red-500/10 text-red-500 border-red-500/20",
  info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

// Auto-detect variant from common status strings
const getVariantFromStatus = (status: string): keyof typeof variantStyles => {
  const normalizedStatus = status.toLowerCase();
  
  if (["connected", "active", "completed", "success"].includes(normalizedStatus)) {
    return "success";
  }
  if (["processing", "pending", "warning"].includes(normalizedStatus)) {
    return "warning";
  }
  if (["failed", "error", "inactive", "not connected"].includes(normalizedStatus)) {
    return "error";
  }
  if (["info"].includes(normalizedStatus)) {
    return "info";
  }
  
  return "default";
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const detectedVariant = variant || getVariantFromStatus(status);
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border",
        variantStyles[detectedVariant],
        className
      )}
    >
      {status}
    </span>
  );
}
