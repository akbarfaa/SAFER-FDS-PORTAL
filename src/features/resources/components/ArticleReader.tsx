/**
 * Resources Center — Active Article Reader Component
 */
import { AlertTriangle } from "lucide-react";
import type { Article } from "../data/articles";

interface ArticleReaderProps {
  article: Article;
}

export function ArticleReader({ article }: ArticleReaderProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 md:p-8">
      <div className="border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-indigo-500/20 text-indigo-400 font-bold px-2 py-0.5 rounded uppercase">{article.category}</span>
          <span className="text-muted-foreground font-medium">{article.readTime}</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground mt-3 leading-tight">{article.title}</h2>
      </div>

      <div className="prose prose-invert max-w-none">
        {article.content}
      </div>

      <div className="mt-8 border-t border-border pt-4 text-[10px] text-muted-foreground flex gap-2">
        <AlertTriangle className="h-4 w-4 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Catatan Edukasi:</strong> Artikel ini dirancang oleh Tim Riset Inovasi SAFER untuk kepentingan edukasi, pelatihan, dan dokumentasi platform evaluasi FDS perbankan nasional.
        </span>
      </div>
    </div>
  );
}
