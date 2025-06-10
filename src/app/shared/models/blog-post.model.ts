export interface BlogPost {
  title: string;
  summary: string;
  slug: string;
  date: string; // YYYY-MM-DD format
  tags: string[];
  imageUrl?: string;
  content?: string; // Contenido completo del artículo en HTML
  author?: string;
  readTime?: number; // Tiempo estimado de lectura en minutos
  pinned?: boolean; // Indica si el post debe aparecer fijado al inicio
}
