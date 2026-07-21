/**
 * Resources Center — Article Selector List Component
 */
import { ArrowRight, HelpCircle } from "lucide-react";
import type { Article } from "../data/articles";

interface ArticleListProps {
  articles: Article[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ArticleList({ articles, selectedId, onSelect }: ArticleListProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider pl-1">Daftar Panduan &amp; Artikel</h4>
      <div className="space-y-2">
        {articles.map((article) => {
          const isActive = article.id === selectedId;
          return (
            <button
              key={article.id}
              onClick={() => onSelect(article.id)}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                isActive
                  ? "border-indigo-500 bg-indigo-500/5 shadow-md shadow-indigo-500/5"
                  : "border-border bg-card hover:bg-muted/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-indigo-400">{article.category}</span>
                <span className="text-[10px] text-muted-foreground">{article.readTime}</span>
              </div>
              <h4 className="mt-1.5 text-sm font-semibold text-foreground line-clamp-1">{article.title}</h4>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{article.summary}</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-indigo-400">
                Baca Selengkapnya <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border border-border bg-card p-4 text-center mt-6">
        <HelpCircle className="h-8 w-8 text-warning mx-auto mb-2" />
        <h5 className="text-xs font-bold text-foreground">Tertarik Menguji Coba Integrasi API?</h5>
        <p className="mt-1 text-[10px] text-muted-foreground leading-relaxed">
          Dapatkan akses langsung ke Sandbox FDS Developer Hub untuk mensimulasikan skoring secara mandiri dengan mengajukan demo.
        </p>
        <div className="mt-4">
          <span className="inline-block text-[10px] font-bold text-warning border border-warning/30 bg-warning/5 px-2.5 py-1.5 rounded uppercase">
            Akses API Sandbox Tersedia via Request Demo
          </span>
        </div>
      </div>
    </div>
  );
}
