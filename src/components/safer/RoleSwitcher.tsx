import { useState, useEffect } from "react";
import { Sliders, Shield, Users, Lock, ChevronUp, ChevronDown } from "lucide-react";

export function RoleSwitcher() {
  const [activeRole, setActiveRole] = useState<string>("admin");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Read from localStorage, default to admin so juri has full access initially
    const savedRole = localStorage.getItem("safer_role") || "admin";
    setActiveRole(savedRole);
  }, []);

  const handleRoleChange = (role: string) => {
    localStorage.setItem("safer_role", role);
    setActiveRole(role);
    setIsOpen(false);
    // Reload page immediately to update TanStack Router navigation visibility
    window.location.reload();
  };

  const ROLES = [
    { id: "analyst", name: "Analyst L1 (Triage)", icon: Users, desc: "Dashboard, Audit, Simulator, Graph" },
    { id: "compliance", name: "Compliance L2 (Auditor)", icon: Shield, desc: "L1 Access + Compliance & Resources" },
    { id: "admin", name: "IT Platform Admin (Full)", icon: Lock, desc: "Full Access + Developer Hub & Configs" },
  ];

  const currentRole = ROLES.find(r => r.id === activeRole) || ROLES[2];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      
      {/* Role Selector Panel */}
      {isOpen && (
        <div className="mb-2 w-72 rounded-lg border border-border bg-card shadow-2xl p-3 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1 pb-1 border-b border-border">
            Pilih Peran Simulasi (RBAC)
          </div>
          <div className="space-y-1">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const isSelected = r.id === activeRole;
              return (
                <button
                  key={r.id}
                  onClick={() => handleRoleChange(r.id)}
                  className={`w-full text-left p-2 rounded flex items-start gap-2.5 transition-colors ${
                    isSelected 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "hover:bg-muted/30 border border-transparent"
                  }`}
                >
                  <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold leading-none">{r.name}</div>
                    <div className="text-[9px] text-muted-foreground mt-1 leading-none">{r.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="text-[9px] text-muted-foreground/80 leading-relaxed px-1">
            *Merubah peran akan merestart menu sidebar navigasi secara visual untuk demonstrasi juri.
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-primary/20 bg-primary/10 hover:bg-primary/15 text-primary text-xs font-semibold shadow-lg backdrop-blur-md transition-all"
      >
        <Sliders className="h-3.5 w-3.5" />
        <span>Role: {currentRole.name.split(" ")[0]}</span>
        {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
      </button>
    </div>
  );
}
