/**
 * Resources Center — Active Article Reader Component (Bilingual i18n Supported)
 */
import { AlertTriangle } from "lucide-react";
import type { Article } from "../data/articles";
import { useTranslation } from "@/lib/i18n";

interface ArticleReaderProps {
  article: Article;
}

export function ArticleReader({ article }: ArticleReaderProps) {
  const { language } = useTranslation();
  const isEn = language === "en";

  const category = isEn ? (article.categoryEn || article.category) : article.category;
  const title = isEn ? (article.titleEn || article.title) : article.title;
  const content = isEn ? (article.contentEn || article.content) : article.content;

  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
      <div className="border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-indigo-500/20 text-indigo-400 font-bold px-2.5 py-0.5 rounded-full uppercase text-[10px]">
            {category}
          </span>
          <span className="text-muted-foreground font-medium">{article.readTime}</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground mt-3 leading-tight">{title}</h2>
      </div>

      <div className="prose prose-invert max-w-none">
        {content}
      </div>

      <div className="mt-8 border-t border-border pt-4 text-[11px] text-muted-foreground flex gap-2">
        <AlertTriangle className="h-4 w-4 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
        <span>
          <strong>{isEn ? "Educational Note:" : "Catatan Edukasi:"}</strong>{" "}
          {isEn
            ? "This article is authored by the SAFER Innovation Research Team for education, training, and documentation of national banking FDS platforms."
            : "Artikel ini dirancang oleh Tim Riset Inovasi SAFER untuk kepentingan edukasi, pelatihan, dan dokumentasi platform evaluasi FDS perbankan nasional."}
        </span>
      </div>
    </div>
  );
}
