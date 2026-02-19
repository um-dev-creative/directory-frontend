import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Avatar, BadgeComponent } from '@app/components/ui';

@Component({
  selector: 'app-avatars-section',
  standalone: true,
  imports: [CommonModule, Avatar, BadgeComponent],
  template: `
    <div class="bg-white rounded-xl shadow-soft p-8 mb-8">
      <h2 class="text-2xl font-bold text-emerald-green-700 mb-6">Avatares</h2>
      <p class="text-beige-700 mb-6">
        Componente Avatar reutilizable con diferentes tamaños y variantes
      </p>

      <!-- Tamaños -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Tamaños</h3>
        <div class="flex items-center gap-4 flex-wrap">
          <div class="flex flex-col items-center gap-2">
            <app-avatar
              size="xs"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="Avatar XS">
            </app-avatar>
            <span class="text-xs text-beige-600">XS</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <app-avatar
              size="sm"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="Avatar SM">
            </app-avatar>
            <span class="text-xs text-beige-600">SM</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <app-avatar
              size="md"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="Avatar MD">
            </app-avatar>
            <span class="text-xs text-beige-600">MD</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <app-avatar
              size="lg"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="Avatar LG">
            </app-avatar>
            <span class="text-xs text-beige-600">LG</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <app-avatar
              size="xl"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="Avatar XL">
            </app-avatar>
            <span class="text-xs text-beige-600">XL</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <app-avatar
              size="2xl"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="Avatar 2XL">
            </app-avatar>
            <span class="text-xs text-beige-600">2XL</span>
          </div>
        </div>
      </div>

      <!-- Variantes -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Variantes</h3>
        <div class="flex items-center gap-6 flex-wrap">
          <div class="flex flex-col items-center gap-2">
            <app-avatar
              variant="circular"
              size="lg"
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
              alt="Avatar Circular">
            </app-avatar>
            <span class="text-sm text-beige-600">Circular</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <app-avatar
              variant="rounded"
              size="lg"
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
              alt="Avatar Rounded">
            </app-avatar>
            <span class="text-sm text-beige-600">Rounded</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <app-avatar
              variant="square"
              size="lg"
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
              alt="Avatar Square">
            </app-avatar>
            <span class="text-sm text-beige-600">Square</span>
          </div>
        </div>
      </div>

      <!-- Con Iniciales -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Con Iniciales</h3>
        <div class="flex items-center gap-4 flex-wrap">
          <app-avatar
            size="md"
            initials="JD"
            alt="John Doe">
          </app-avatar>
          <app-avatar
            size="md"
            initials="AM"
            variant="rounded"
            alt="Ana Martinez">
          </app-avatar>
          <app-avatar
            size="md"
            initials="PG"
            variant="square"
            alt="Pedro Gonzalez">
          </app-avatar>
        </div>
      </div>

      <!-- Sin Imagen (Fallback) -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Fallback Icon</h3>
        <div class="flex items-center gap-4 flex-wrap">
          <app-avatar size="md" alt="Default Avatar"></app-avatar>
          <app-avatar size="md" variant="rounded" alt="Default Avatar Rounded"></app-avatar>
          <app-avatar size="md" variant="square" alt="Default Avatar Square"></app-avatar>
        </div>
      </div>

      <!-- Con Badge -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Con Badge</h3>
        <div class="flex items-center gap-4 flex-wrap">
          <div class="relative">
            <app-avatar
              size="lg"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              alt="Avatar con badge online">
            </app-avatar>
            <app-badge
              variant="success"
              size="xs"
              shape="pill"
              class="absolute bottom-1 right-1">
              99+
            </app-badge>
          </div>
          <div class="relative">
            <app-avatar
              size="lg"
              initials="MB"
              alt="Avatar con badge offline">
            </app-avatar>
            <app-badge
              variant="default"
              size="xs"
              shape="pill"
              class="absolute bottom-1 right-1">
              99+
            </app-badge>
          </div>
          <div class="relative">
            <app-avatar
              size="lg"
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
              alt="Avatar con badge busy">
            </app-avatar>
            <app-badge
              variant="error"
              size="xs"
              shape="pill"
              class="absolute bottom-1 right-1">
              99+
            </app-badge>
          </div>
        </div>
      </div>

      <!-- Estados -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-emerald-green-700 mb-4">Estados</h3>
        <div class="flex items-center gap-4 flex-wrap">
          <div class="flex flex-col items-center gap-2">
            <app-avatar
              size="lg"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
              alt="Avatar normal">
            </app-avatar>
            <span class="text-sm text-beige-600">Normal</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <app-avatar
              size="lg"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
              alt="Avatar loading"
              [loading]="true">
            </app-avatar>
            <span class="text-sm text-beige-600">Loading</span>
          </div>
        </div>
      </div>

      <!-- Código de Ejemplo -->
      <div class="bg-beige-50 rounded-lg p-4">
        <h4 class="text-sm font-semibold text-emerald-green-700 mb-3">Código de Ejemplo:</h4>
        <pre class="text-sm text-beige-700 overflow-x-auto"><code>&lt;!-- Avatar con imagen --&gt;
&lt;app-avatar
  src="https://example.com/avatar.jpg"
  alt="Usuario"
  size="md"
  variant="circular"&gt;
&lt;/app-avatar&gt;

&lt;!-- Avatar con iniciales --&gt;
&lt;app-avatar
  initials="JD"
  size="lg"
  variant="rounded"&gt;
&lt;/app-avatar&gt;

&lt;!-- Avatar con badge --&gt;
&lt;div class="relative"&gt;
  &lt;app-avatar
    src="https://example.com/avatar.jpg"
    alt="Usuario online"
    size="lg"&gt;
  &lt;/app-avatar&gt;
  &lt;app-badge
    variant="success"
    [dot]="true"
    size="xs"
    class="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4"&gt;
  &lt;/app-badge&gt;
&lt;/div&gt;</code></pre>
      </div>
    </div>
  `
})
export class AvatarsSectionComponent {
}
