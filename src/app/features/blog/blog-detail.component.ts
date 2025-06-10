import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
  signal,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { Meta, Title, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BlogService } from '@app/core/services/blog.service';
import { BlogPost } from '@app/shared/models/blog-post.model';
import { LoadingService } from '@app/core/services/loading.service';
import { Button, BadgeComponent, SkeletonComponent } from '@app/components/ui';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Button, BadgeComponent, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tw-p-2 tw-bg-gradient-hero tw-min-h-screen">
      <!-- Loading State -->
      @if (isLoading()) {
        <div class="tw-max-w-4xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-py-8">
          <app-skeleton
            variant="default"
            [loading]="true"
            [count]="1"
            [height]="32"
            class="tw-mb-4"
          ></app-skeleton>
          <app-skeleton
            variant="default"
            [loading]="true"
            [count]="1"
            [height]="48"
            class="tw-mb-6"
          ></app-skeleton>
          <app-skeleton
            variant="default"
            [loading]="true"
            [count]="1"
            [height]="256"
            class="tw-mb-8"
          ></app-skeleton>
          <app-skeleton
            variant="default"
            [loading]="true"
            [count]="5"
            [height]="16"
          ></app-skeleton>
        </div>
      }

      <!-- Not Found State -->
      @if (!isLoading() && !blogPost()) {
        <div class="tw-max-w-4xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-py-16 tw-text-center">
          <div class="tw-mx-auto tw-h-24 tw-w-24 tw-text-gray-400 tw-mb-6">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 class="tw-text-3xl tw-font-bold tw-text-gray-900 tw-mb-4">
            Artículo no encontrado
          </h1>
          <p class="tw-text-gray-600 tw-mb-8">
            El artículo que buscas no existe o ha sido removido.
          </p>
          <a
            [routerLink]="['/blog']"
            class="tw-inline-flex tw-items-center tw-px-6 tw-py-3 tw-text-sm tw-font-medium tw-rounded-lg tw-transition-all tw-duration-200 tw-no-underline"
            style="background-color: var(--emerald-600); color: white;"
            onmouseover="this.style.backgroundColor='var(--emerald-700)'"
            onmouseout="this.style.backgroundColor='var(--emerald-600)'"
          >
            <svg class="tw-mr-2 tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver al blog
          </a>
        </div>
      }

      <!-- Article Content -->
      @if (!isLoading() && blogPost()) {
        <article class="tw-max-w-4xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-py-8"
                 [attr.itemscope]="true"
                 [attr.itemtype]="'https://schema.org/BlogPosting'">

          <!-- Breadcrumb -->
          <nav class="tw-mb-8" aria-label="Breadcrumb">
            <ol class="tw-flex tw-items-center tw-space-x-2 tw-text-sm tw-text-gray-500 tw-overflow-hidden">
              <li class="tw-flex-shrink-0">
                <a [routerLink]="['/']" class="hover:tw-text-gray-700 tw-transition-colors">
                  Inicio
                </a>
              </li>
              <li class="tw-flex-shrink-0">
                <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </li>
              <li class="tw-flex-shrink-0">
                <a [routerLink]="['/blog']" class="hover:tw-text-gray-700 tw-transition-colors">
                  Blog
                </a>
              </li>
              <li class="tw-flex-shrink-0">
                <svg class="tw-w-4 tw-h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </li>
              <li class="tw-text-gray-900 tw-font-medium tw-min-w-0 tw-truncate" aria-current="page" [title]="blogPost()?.title">
                {{ blogPost()?.title }}
              </li>
            </ol>
          </nav>
          <!-- Article Header and Content Container -->
          <div class="tw-bg-white tw-rounded-xl tw-shadow-soft tw-p-8 tw-mb-8">
            <!-- Article Header -->
            <header class="tw-mb-8">
              <h1 class="tw-text-4xl md:tw-text-5xl tw-font-bold tw-mb-6 tw-leading-tight"
                  style="color: var(--emerald-800);"
                  [attr.itemprop]="'name headline'">
                {{ blogPost()?.title }}
              </h1>

              <!-- Article Meta -->
              <div class="tw-flex tw-flex-wrap tw-items-center tw-gap-6 tw-text-gray-600 tw-mb-6">
                <!-- Author -->
                @if (blogPost()?.author) {
                  <div class="tw-flex tw-items-center">
                    <svg class="tw-w-5 tw-h-5 tw-mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <span [attr.itemprop]="'author'">{{ blogPost()?.author }}</span>
                  </div>
                }

                <!-- Date -->
                <div class="tw-flex tw-items-center">
                  <svg class="tw-w-5 tw-h-5 tw-mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 0 5.25 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5" />
                  </svg>
                  <time [attr.datetime]="blogPost()?.date" [attr.itemprop]="'datePublished'">
                    {{ formatDate(blogPost()?.date) }}
                  </time>
                </div>

                <!-- Read Time -->
                @if (blogPost()?.readTime) {
                  <div class="tw-flex tw-items-center">
                    <svg class="tw-w-5 tw-h-5 tw-mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span>{{ blogPost()?.readTime }} min de lectura</span>
                  </div>
                }
              </div>

              <!-- Tags -->
              @if (blogPost()?.tags && blogPost()!.tags.length > 0) {
                <div class="tw-flex tw-flex-wrap tw-gap-2 tw-mb-8">
                  @for (tag of blogPost()!.tags; track tag) {
                    <app-badge
                      variant="secondary"
                      size="sm"
                      [attr.itemprop]="'keywords'"
                    >
                      {{ tag }}
                    </app-badge>
                  }
                </div>
              }
            </header>

            <!-- Featured Image -->
            @if (blogPost()?.imageUrl) {
              <div class="tw-mb-8 tw-rounded-xl tw-overflow-hidden tw-shadow-lg">
                <img
                  [src]="blogPost()?.imageUrl"
                  [alt]="'Imagen del artículo: ' + blogPost()?.title"
                  class="tw-w-full tw-h-64 md:tw-h-96 tw-object-cover"
                  [attr.itemprop]="'image'"
                  loading="lazy"
                />
              </div>
            }

            <!-- Article Summary -->
            <div class="tw-bg-emerald-50 tw-border-l-4 tw-border-emerald-500 tw-p-6 tw-mb-8 tw-rounded-r-lg">
              <p class="tw-text-lg tw-text-gray-700 tw-leading-relaxed tw-font-medium"
                 [attr.itemprop]="'description'">
                {{ blogPost()?.summary }}
              </p>
            </div>

            <!-- Article Content -->
            @if (blogPost()?.content) {
              <div class="tw-prose tw-prose-lg tw-max-w-none tw-prose-emerald"
                   [attr.itemprop]="'articleBody'"
                   [innerHTML]="getSafeHtml(blogPost()?.content)">
              </div>
            }

            <!-- Article Footer -->
            <footer class="tw-mt-12 tw-pt-8 tw-border-t tw-border-gray-200">
              <!-- Share buttons -->
              <div class="tw-mb-8">
                <h3 class="tw-text-lg tw-font-semibold tw-mb-4" style="color: var(--emerald-700);">
                  Comparte este artículo
                </h3>
                <div class="tw-flex tw-flex-col sm:tw-flex-row tw-gap-3 sm:tw-gap-4">
                  <!-- Twitter Button -->
                  <button
                    type="button"
                    (click)="shareOnTwitter()"
                    class="tw-inline-flex tw-items-center tw-justify-center tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-rounded-lg tw-text-white tw-transition-all tw-duration-200 tw-w-full sm:tw-w-auto"
                    style="background-color: #1DA1F2;"
                    onmouseover="this.style.backgroundColor='#1991DA'"
                    onmouseout="this.style.backgroundColor='#1DA1F2'"
                  >
                    <svg class="tw-w-4 tw-h-4 tw-mr-2 tw-flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    <span class="tw-truncate">Twitter</span>
                  </button>

                  <!-- LinkedIn Button -->
                  <button
                    type="button"
                    (click)="shareOnLinkedIn()"
                    class="tw-inline-flex tw-items-center tw-justify-center tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-rounded-lg tw-text-white tw-transition-all tw-duration-200 tw-w-full sm:tw-w-auto"
                    style="background-color: #0077B5;"
                    onmouseover="this.style.backgroundColor='#005885'"
                    onmouseout="this.style.backgroundColor='#0077B5'"
                  >
                    <svg class="tw-w-4 tw-h-4 tw-mr-2 tw-flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span class="tw-truncate">LinkedIn</span>
                  </button>

                  <!-- Copy Link Button usando el componente Button -->
                  <div class="tw-w-full sm:tw-w-auto">
                    <app-button
                      [variant]="copySuccess() ? 'success' : 'secondary'"
                      size="sm"
                      (buttonClick)="copyToClipboard()"
                      class="tw-w-full sm:tw-w-auto tw-justify-center"
                    >
                      @if (copySuccess()) {
                        <svg class="tw-w-4 tw-h-4 tw-mr-2 tw-flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span class="tw-truncate">¡Copiado!</span>
                      } @else {
                        <svg class="tw-w-4 tw-h-4 tw-mr-2 tw-flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                        </svg>
                        <span class="tw-truncate">Copiar enlace</span>
                      }
                    </app-button>
                  </div>
                </div>
              </div>

              <!-- Back to blog -->
              <div class="tw-text-center">
                <app-button
                  variant="primary"
                  size="md"
                  (buttonClick)="navigateToBlog()"
                >
                  <svg class="tw-mr-2 tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                  Volver al blog
                </app-button>
              </div>
            </footer>
          </div>

          <!-- Recent Posts Section -->
          @if (recentPosts().length > 0) {
            <section class="tw-mt-16 tw-mb-12">
              <div class="tw-border-t tw-border-gray-200 tw-pt-12">
                <h3 class="tw-text-2xl tw-font-bold tw-mb-8 tw-text-center"
                    style="color: var(--emerald-800);">
                  Posts Recientes
                </h3>
                <div class="tw-grid tw-gap-8 tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3">
                  @for (post of recentPosts(); track trackBySlug($index, post)) {
                    <article
                      class="tw-bg-white tw-rounded-xl tw-shadow-lg tw-overflow-hidden tw-transition-all tw-duration-300 hover:tw-shadow-xl hover:tw--translate-y-2 tw-group"
                    >
                      <!-- Image -->
                      @if (post.imageUrl) {
                        <div class="tw-relative tw-h-48 tw-overflow-hidden">
                          <img
                            [src]="post.imageUrl"
                            [alt]="'Imagen del artículo: ' + post.title"
                            class="tw-w-full tw-h-full tw-object-cover tw-transition-transform tw-duration-300 group-hover:tw-scale-105"
                            loading="lazy"
                          />
                          <div class="tw-absolute tw-inset-0 tw-bg-gradient-to-t tw-from-black/20 tw-to-transparent"></div>
                        </div>
                      }

                      <!-- Content -->
                      <div class="tw-p-6">
                        <!-- Title -->
                        <h4 class="tw-text-lg tw-font-bold tw-mb-3 tw-line-clamp-2"
                            style="color: var(--emerald-800);">
                          <a
                            (click)="navigateToPost(post.slug)"
                            class="tw-no-underline hover:tw-underline tw-transition-colors tw-cursor-pointer"
                          >
                            {{ post.title }}
                          </a>
                        </h4>

                        <!-- Summary -->
                        <p class="tw-text-gray-600 tw-mb-4 tw-line-clamp-3 tw-leading-relaxed tw-text-sm">
                          {{ post.summary }}
                        </p>

                        <!-- Date -->
                        <div class="tw-flex tw-items-center tw-mb-4 tw-text-sm tw-text-gray-500">
                          <svg class="tw-w-4 tw-h-4 tw-mr-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 0 5.25 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5" />
                          </svg>
                          <time [attr.datetime]="post.date">
                            {{ formatDate(post.date) }}
                          </time>
                        </div>

                        <!-- Tags -->
                        @if (post.tags && post.tags.length > 0) {
                          <div class="tw-flex tw-flex-wrap tw-gap-2 tw-mb-4">
                            @for (tag of post.tags.slice(0, 2); track tag) {
                              <span
                                class="tw-px-2 tw-py-1 tw-text-xs tw-font-medium tw-rounded-full tw-transition-colors"
                                style="background-color: var(--emerald-100); color: var(--emerald-700);"
                              >
                                {{ tag }}
                              </span>
                            }
                            @if (post.tags.length > 2) {
                              <span class="tw-text-xs tw-text-gray-500">
                                +{{ post.tags.length - 2 }} más
                              </span>
                            }
                          </div>
                        }

                        <!-- Read More Link -->
                        <div class="tw-mt-4">
                          <button
                            type="button"
                            (click)="navigateToPost(post.slug)"
                            class="tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-rounded-lg tw-transition-all tw-duration-200 tw-no-underline tw-border-none tw-cursor-pointer"
                            style="background-color: var(--emerald-600); color: white;"
                            onmouseover="this.style.backgroundColor='var(--emerald-700)'"
                            onmouseout="this.style.backgroundColor='var(--emerald-600)'"
                            [attr.aria-label]="'Leer artículo: ' + post.title"
                          >
                            Leer más
                            <svg class="tw-ml-2 tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </article>
                  }
                </div>
              </div>
            </section>
          }
        </article>

        <!-- JSON-LD Schema -->
        @if (isBrowser() && blogPost()) {
          <script type="application/ld+json" [innerHTML]="getJsonLdSchema()"></script>
        }
      }
    </div>
  `,
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly blogService = inject(BlogService);
  private readonly loadingService = inject(LoadingService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly document = inject(DOCUMENT);
  private readonly destroy$ = new Subject<void>();

  // Signals for reactive state management
  protected readonly blogPost = signal<BlogPost | null>(null);
  protected readonly recentPosts = signal<BlogPost[]>([]);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly copySuccess = signal<boolean>(false);

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const slug = params['slug'];
        if (slug) {
          this.loadBlogPost(slug);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBlogPost(slug: string): void {
    this.isLoading.set(true);
    this.loadingService.show('blog-detail');

    this.blogService.getBlogPostBySlug(slug)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingService.hide('blog-detail');
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (post) => {
          if (post) {
            this.blogPost.set(post);
            this.updateMetaTags(post);
            this.loadRecentPosts(slug);
          } else {
            // Redirect to 404 or blog list if post not found
            this.router.navigate(['/blog']);
          }
        },
        error: (error) => {
          console.error('Error loading blog post:', error);
          this.router.navigate(['/blog']);
        }
      });
  }

  private loadRecentPosts(excludeSlug: string): void {
    this.blogService.getRecentPosts(excludeSlug, 3)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (posts) => {
          this.recentPosts.set(posts);
        },
        error: (error) => {
          console.error('Error loading recent posts:', error);
          this.recentPosts.set([]);
        }
      });
  }

  private updateMetaTags(post: BlogPost): void {
    // Update page title
    this.title.setTitle(`${post.title} | Latin Hub Blog`);

    // Update meta tags for SEO
    this.meta.updateTag({ name: 'description', content: post.summary });
    this.meta.updateTag({ name: 'keywords', content: post.tags.join(', ') });

    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: post.title });
    this.meta.updateTag({ property: 'og:description', content: post.summary });
    this.meta.updateTag({ property: 'og:type', content: 'article' });

    if (post.imageUrl) {
      this.meta.updateTag({ property: 'og:image', content: post.imageUrl });
    }

    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: post.title });
    this.meta.updateTag({ name: 'twitter:description', content: post.summary });

    if (post.imageUrl) {
      this.meta.updateTag({ name: 'twitter:image', content: post.imageUrl });
    }

    // Article specific tags
    this.meta.updateTag({ property: 'article:published_time', content: post.date });
    if (post.author) {
      this.meta.updateTag({ property: 'article:author', content: post.author });
    }
    post.tags.forEach(tag => {
      this.meta.updateTag({ property: 'article:tag', content: tag });
    });
  }

  protected formatDate(dateString: string | undefined): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  protected getSafeHtml(content: string | undefined): SafeHtml {
    if (!content) return '';
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  protected isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  protected getJsonLdSchema(): string {
    const post = this.blogPost();
    if (!post || !this.isBrowser()) {
      return '';
    }
    return this.blogService.generateBlogPostingSchema(post);
  }

  protected shareOnTwitter(): void {
    const post = this.blogPost();
    if (!post || !this.isBrowser()) return;

    const url = encodeURIComponent(this.document.location.href);
    const text = encodeURIComponent(`${post.title} - ${post.summary}`);
    const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;

    this.document.defaultView?.open(twitterUrl, '_blank');
  }

  protected shareOnLinkedIn(): void {
    const post = this.blogPost();
    if (!post || !this.isBrowser()) return;

    const url = encodeURIComponent(this.document.location.href);
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;

    this.document.defaultView?.open(linkedInUrl, '_blank');
  }

  protected async copyToClipboard(): Promise<void> {
    if (!this.isBrowser()) return;

    const url = this.document.location.href;

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        this.showCopySuccess();
        return;
      }

      // Fallback for older browsers or non-secure contexts
      const textArea = this.document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      this.document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = this.document.execCommand('copy');
      this.document.body.removeChild(textArea);

      if (successful) {
        this.showCopySuccess();
      } else {
        throw new Error('Copy command failed');
      }
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Show error message or alert
      alert('No se pudo copiar el enlace. Por favor, cópialo manualmente desde la barra de direcciones.');
    }
  }

  protected navigateToBlog(): void {
    this.router.navigate(['/blog']);
  }

  protected navigateToPost(slug: string): void {
    this.router.navigate(['/blog', slug]).then(() => {
      if (this.isBrowser()) {
        this.document.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  protected trackBySlug(index: number, post: BlogPost): string {
    return post.slug || index.toString();
  }

  private showCopySuccess(): void {
    this.copySuccess.set(true);
    // Reset after 2 seconds
    setTimeout(() => {
      this.copySuccess.set(false);
    }, 2000);
  }
}
