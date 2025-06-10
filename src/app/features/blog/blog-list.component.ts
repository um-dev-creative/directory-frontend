import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  OnDestroy,
  signal,
  PLATFORM_ID,
  Renderer2
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { BlogService } from '@app/core/services/blog.service';
import { BlogPost } from '@app/shared/models/blog-post.model';
import { LoadingService } from '@app/core/services/loading.service';
import { BadgeComponent } from '@app/components/ui';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tw-p-2 tw-bg-gradient-hero tw-min-h-screen">
      <div class="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8">
        <!-- Header Section -->
        <section class="tw-text-center tw-mb-12">
          <h1 class="tw-text-4xl md:tw-text-5xl tw-font-bold tw-mb-4"
              style="color: var(--emerald-700);">
            Blog de Latin Hub
          </h1>
          <p class="tw-text-lg tw-text-gray-600 tw-max-w-2xl tw-mx-auto">
            Descubre insights, tendencias y consejos para impulsar tu negocio en el ecosistema latino
          </p>
        </section>

        <!-- Loading State -->
        @if (isLoading()) {
          <div class="tw-grid tw-gap-8 tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3">
            @for (skeleton of [1,2,3,4,5,6]; track skeleton) {
              <div class="tw-bg-white tw-rounded-xl tw-shadow-lg tw-overflow-hidden tw-animate-pulse">
                <div class="tw-h-48 tw-bg-gray-200"></div>
                <div class="tw-p-6">
                  <div class="tw-h-4 tw-bg-gray-200 tw-rounded tw-mb-4"></div>
                  <div class="tw-h-4 tw-bg-gray-200 tw-rounded tw-mb-2 tw-w-3/4"></div>
                  <div class="tw-h-4 tw-bg-gray-200 tw-rounded tw-mb-4 tw-w-1/2"></div>
                  <div class="tw-flex tw-gap-2 tw-mb-4">
                    <div class="tw-h-6 tw-w-16 tw-bg-gray-200 tw-rounded-full"></div>
                    <div class="tw-h-6 tw-w-20 tw-bg-gray-200 tw-rounded-full"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Empty State -->
        @if (!isLoading() && blogPosts().length === 0) {
          <div class="tw-text-center tw-py-16">
            <div class="tw-mx-auto tw-h-24 tw-w-24 tw-text-gray-400 tw-mb-6">
              <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <h3 class="tw-text-lg tw-font-medium tw-text-gray-900 tw-mb-2">
              No hay publicaciones disponibles
            </h3>
            <p class="tw-text-gray-500">
              Pronto tendremos contenido interesante para compartir contigo.
            </p>
          </div>
        }

        <!-- Blog Posts Grid -->
        @if (!isLoading() && blogPosts().length > 0) {
          <section class="tw-grid tw-gap-8 tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3">
            @for (post of blogPosts(); track post.slug) {
              <article
                class="tw-bg-white tw-rounded-xl tw-shadow-lg tw-overflow-hidden tw-transition-all tw-duration-300 hover:tw-shadow-xl hover:tw--translate-y-2 tw-group tw-relative"
                [attr.itemscope]="true"
                [attr.itemtype]="'https://schema.org/BlogPosting'"
              >
                <!-- Image -->
                @if (post.imageUrl) {
                  <div class="tw-relative tw-h-48 tw-overflow-hidden">
                    <img
                      [src]="post.imageUrl"
                      [alt]="'Imagen del artículo: ' + post.title"
                      class="tw-w-full tw-h-full tw-object-cover tw-transition-transform tw-duration-300 group-hover:tw-scale-105"
                      [attr.itemprop]="'image'"
                      loading="lazy"
                    />
                    <div class="tw-absolute tw-inset-0 tw-bg-gradient-to-t tw-from-black/20 tw-to-transparent"></div>
                  </div>
                }

                <!-- Content -->
                <div class="tw-p-6">
                  <!-- Title -->
                  <h2 class="tw-text-xl tw-font-bold tw-mb-3 tw-line-clamp-2"
                      style="color: var(--emerald-800);"
                      [attr.itemprop]="'name headline'">
                    <a
                      [routerLink]="['/blog', post.slug]"
                      class="tw-no-underline hover:tw-underline tw-transition-colors"
                      [attr.rel]="'bookmark'"
                      [attr.itemprop]="'url'"
                    >
                      {{ post.title }}
                    </a>
                  </h2>

                  <!-- Summary -->
                  <p class="tw-text-gray-600 tw-mb-4 tw-line-clamp-3 tw-leading-relaxed"
                     [attr.itemprop]="'description'">
                    {{ post.summary }}
                  </p>

                  <!-- Date -->
                  <div class="tw-flex tw-items-center tw-mb-4 tw-text-sm tw-text-gray-500">
                    <svg class="tw-w-4 tw-h-4 tw-mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 0 5.25 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5" />
                    </svg>
                    <time
                      [attr.datetime]="post.date"
                      [attr.itemprop]="'datePublished'"
                    >
                      {{ formatDate(post.date) }}
                    </time>
                  </div>

                  <!-- Tags -->
                  @if (post.tags && post.tags.length > 0) {
                    <div class="tw-flex tw-flex-wrap tw-gap-2 tw-mb-4">
                      @for (tag of post.tags; track tag) {
                        <span
                          class="tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-rounded-full tw-transition-colors"
                          style="background-color: var(--emerald-100); color: var(--emerald-700);"
                          [attr.itemprop]="'keywords'"
                        >
                          {{ tag }}
                        </span>
                      }
                    </div>
                  }
                  <!-- Actions Row: Read More Button and Pinned Badge -->
                  <div class="tw-mt-6 tw-flex tw-items-center tw-justify-between">
                    <a
                      [routerLink]="['/blog', post.slug]"
                      class="tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-rounded-lg tw-transition-all tw-duration-200 tw-no-underline"
                      style="background-color: var(--emerald-600); color: white;"
                      onmouseover="this.style.backgroundColor='var(--emerald-700)'"
                      onmouseout="this.style.backgroundColor='var(--emerald-600)'"
                      [attr.aria-label]="'Leer artículo completo: ' + post.title"
                    >
                      Leer más
                      <svg class="tw-ml-2 tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </a>

                    <!-- Pinned Badge -->
                    @if (post.pinned) {
                      <app-badge variant="warning" [trailingIcon]="true">
                        Fijado
                        <svg slot="trailing-icon" class="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"></path>
                        </svg>
                      </app-badge>
                    }
                  </div>
                </div>

                <!-- Hidden structured data -->
                <div
                  class="tw-hidden"
                  [attr.itemprop]="'author'"
                  [attr.itemscope]="true"
                  [attr.itemtype]="'https://schema.org/Organization'"
                >
                  <span [attr.itemprop]="'name'">Latin Hub</span>
                </div>
              </article>
            }
          </section>
        }
      </div>
    </div>
  `,
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit, OnDestroy {
  private readonly blogService = inject(BlogService);
  private readonly loadingService = inject(LoadingService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private readonly destroy$ = new Subject<void>();

  // Signals for reactive state management
  protected readonly blogPosts = signal<BlogPost[]>([]);
  protected readonly isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadBlogPosts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBlogPosts(): void {
    this.loadingService.show('blog-posts');

    this.blogService.getBlogPosts()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingService.hide('blog-posts');
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (posts) => {
          const sortedPosts = this.blogService.sortPostsByDate(posts);
          this.blogPosts.set(sortedPosts);
          this.addStructuredData(sortedPosts);
        },
        error: (error) => {
          console.error('Error loading blog posts:', error);
          this.blogPosts.set([]);
        }
      });
  }

  protected formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  private addStructuredData(posts: BlogPost[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Remove existing JSON-LD scripts
    const existingScripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // Add new JSON-LD for each post
    posts.forEach(post => {
      const script = this.renderer.createElement('script');
      this.renderer.setAttribute(script, 'type', 'application/ld+json');
      const jsonLd = this.blogService.generateBlogPostingSchema(post);
      this.renderer.appendChild(script, this.renderer.createText(jsonLd));
      this.renderer.appendChild(this.document.head, script);
    });
  }
}
