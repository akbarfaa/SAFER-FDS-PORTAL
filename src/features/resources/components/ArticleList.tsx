/**
 * Resources Center — Article Selector List Component (Bilingual i18n Supported)
 */
import { ArrowRight, HelpCircle } from "lucide-react";
import type { Article } from "../data/articles";
import { useTranslation } from "@/lib/i18n";

interface ArticleListProps {
  articles: Article[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ArticleList({ articles, selectedId, onSelect }: ArticleListProps) {
  const { language } = useTranslation();
  const isEn = language === "en";

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider pl-1">
        {isEn ? "Guides & Knowledge List" : "Daftar Panduan & Artikel"}
      </h4>
      <div className="space-y-2">
        {articles.map((article) => {
          const isActive = article.id === selectedId;
          const category = isEn ? (article.categoryEn || article.category) : article.category;
          const title = isEn ? (article.titleEn || article.title) : article.title;
          const summary = isEn ? (article.summaryEn || article.summary) : article.summary;

          return (
            <button
              key={article.id}
              onClick={() => onSelect(article.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                isActive
                  ? "border-indigo-500 bg-indigo-500/10 shadow-md shadow-indigo-500/10"
                  : "border-border bg-card hover:bg-muted/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-indigo-400">{category}</span>
                <span className="text-[10px] text-muted-foreground">{article.readTime}</span>
              </div>
              <h4 className="mt-1.5 text-sm font-semibold text-foreground line-clamp-1">{title}</h4>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{summary}</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-indigo-400">
                {isEn ? "Read Article" : "Baca Selengkapnya"} <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 text-center mt-6 shadow-sm">
        <HelpCircle className="h-8 w-8 text-primary mx-auto mb-2" />
        <h5 className="text-xs font-bold text-foreground">
          {isEn ? "Interested in Testing API Integration?" : "Tertarik Menguji Coba Integrasi API?"}
        </h5>
        <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
          {isEn 
            ? "Access the Developer Hub & API Sandbox to test real-time fraud scoring API payloads."
            : "Dapatkan akses langsung ke Sandbox FDS Developer Hub untuk mensimulasikan skoring secara mandiri."}
        </p>
        <div className="mt-4">
          <span className="inline-block text-[10px] font-bold text-foreground border border-border bg-muted/40 px-2.5 py-1.5 rounded-lg uppercase">
            {isEn ? "API Sandbox Access Available via Developer Hub" : "Akses API Sandbox Tersedia via Request Demo"}
          </span>
        </div>
      </div>
    </div>
  );
}
