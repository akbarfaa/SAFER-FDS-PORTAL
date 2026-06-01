import { Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export function LanguageToggle() {
  const { language, toggleLanguage } = useTranslation();

  return (
    <button
      onClick={toggleLanguage}
      className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      title="Change Language"
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase">{language}</span>
    </button>
  );
}
