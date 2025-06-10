import { Injectable, inject, TransferState, makeStateKey, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { BlogPost } from '@app/shared/models/blog-post.model';

const BLOG_POSTS_KEY = makeStateKey<BlogPost[]>('blog-posts');

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Carga los posts del blog con soporte para SSR usando TransferState
   */
  getBlogPosts(): Observable<BlogPost[]> {
    // Verificar si ya tenemos los datos en el TransferState (hidratación del cliente)
    const storedPosts = this.transferState.get(BLOG_POSTS_KEY, null);

    if (storedPosts) {
      // Si los datos están disponibles en el TransferState, usarlos
      return of(storedPosts);
    }

    // Cargar los datos desde el archivo JSON
    return this.http.get<BlogPost[]>('/assets/data/blog-posts.json').pipe(
      tap((posts: BlogPost[]) => {
        // Guardar los datos en el TransferState para la hidratación del cliente
        this.transferState.set(BLOG_POSTS_KEY, posts);
      }),
      catchError((error) => {
        console.error('Error loading blog posts:', error);
        return of([]); // Retornar array vacío en caso de error
      })
    );
  }

  /**
   * Ordena los posts priorizando los fijados y luego por fecha descendente
   */
  sortPostsByDate(posts: BlogPost[]): BlogPost[] {
    return posts.sort((a, b) => {
      // Primero, ordenar por posts fijados (pinned posts van primero)
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      // Si ambos tienen el mismo estado de pinned, ordenar por fecha descendente
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  /**
   * Obtiene un post específico por su slug
   */
  getBlogPostBySlug(slug: string): Observable<BlogPost | null> {
    return this.getBlogPosts().pipe(
      map((posts: BlogPost[]) => posts.find((post: BlogPost) => post.slug === slug) || null),
      catchError((error) => {
        console.error('Error getting blog post by slug:', error);
        return of(null);
      })
    );
  }

  /**
   * Obtiene posts recientes excluyendo el post actual
   */
  getRecentPosts(excludeSlug?: string, limit: number = 3): Observable<BlogPost[]> {
    return this.getBlogPosts().pipe(
      map((posts: BlogPost[]) => {
        // Filtrar el post actual si se proporciona el slug
        const filteredPosts = excludeSlug
          ? posts.filter(post => post.slug !== excludeSlug)
          : posts;

        // Ordenar priorizando posts fijados y luego por fecha, y limitar la cantidad
        return this.sortPostsByDate(filteredPosts).slice(0, limit);
      }),
      catchError((error) => {
        console.error('Error getting recent posts:', error);
        return of([]);
      })
    );
  }

  /**
   * Genera el JSON-LD para schema.org de un BlogPosting
   */
  generateBlogPostingSchema(post: BlogPost): string {
    // Usar una URL base segura que funcione tanto en servidor como cliente
    const baseUrl = isPlatformBrowser(this.platformId) && typeof window !== 'undefined'
      ? window.location.origin
      : 'https://localhost:7001'; // URL base por defecto para SSR

    const schema: any = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.summary,
      "url": `${baseUrl}/blog/${post.slug}`,
      "datePublished": post.date,
      "dateModified": post.date,
      "author": {
        "@type": "Organization",
        "name": "Latin Hub"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Latin Hub",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/assets/images/latin_hub_logo_v1.svg`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${baseUrl}/blog/${post.slug}`
      }
    };

    if (post.imageUrl) {
      schema.image = {
        "@type": "ImageObject",
        "url": post.imageUrl,
        "width": 800,
        "height": 400
      };
    }

    return JSON.stringify(schema);
  }
}
