import {
  Hourglass,
  Search,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Ban,
  Check,
  type LucideIcon,
} from "lucide-react";
import { type AuditStatus, AUDIT_STATUS_META } from "@/lib/transaction-store";

export const AUDIT_STATUS_ICONS: Record<AuditStatus, LucideIcon> = {
  pending_review: Hourglass,
  under_investigation: Search,
  planned_audit: ClipboardList,
  audited_legitimate: CheckCircle2,
  audited_suspicious: AlertTriangle,
  escalated: AlertOctagon,
  blocked: Ban,
  cleared: Check,
};

interface AuditStatusBadgeProps {
  status: AuditStatus;
  showIconOnly?: boolean;
  className?: string;
  iconClassName?: string;
}

export function AuditStatusBadge({
  status,
  showIconOnly = false,
  className = "",
  iconClassName = "h-3 w-3",
}: AuditStatusBadgeProps) {
  const meta = AUDIT_STATUS_META[status];
  const Icon = AUDIT_STATUS_ICONS[status];

  if (!meta) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium transition-all ${meta.bg} ${meta.color} ${className}`}
    >
      <Icon className={`${iconClassName} shrink-0`} />
      {!showIconOnly && <span>{meta.label}</span>}
    </span>
  );
}
