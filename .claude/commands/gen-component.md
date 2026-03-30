# /gen-component — Generar componente Angular standalone

Genera un componente Angular 20 standalone completo siguiendo las convenciones del proyecto.

## Uso

```
/gen-component <nombre> [--feature <feature>] [--tipo ui|feature|layout]
```

**Ejemplos:**
- `/gen-component tarjeta-producto --feature partner --tipo ui`
- `/gen-component lista-favoritos --feature community-member`
- `/gen-component banner-principal --tipo layout`

---

## Lo que debes generar

Para el nombre dado (en kebab-case), crea los siguientes archivos:

### 1. `<nombre>.component.ts`

```typescript
import { Component, inject, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
// Importa aquí solo lo que el template necesite

@Component({
  selector: 'app-<nombre>',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    // Agrega imports adicionales según necesidad
  ],
  templateUrl: './<nombre>.component.html',
  styleUrls: ['./<nombre>.component.css']
})
export class <NombreComponent> {
  // Usa inject() para dependencias
  // private readonly miServicio = inject(MiServicio);

  // Usa signals para estado local
  // protected readonly estadoLocal = signal<Tipo>(valorInicial);
}
```

### 2. `<nombre>.component.html`

- Usa `@if` / `@for` / `@let` — **nunca** `*ngIf` / `*ngFor`
- Todo texto visible con `{{ 'clave.traduccion' | translate }}`
- Clases CSS con Tailwind v4

```html
<section class="...">
  @if (condicion) {
    <p>{{ 'feature.nombre.descripcion' | translate }}</p>
  }

  @for (item of items(); track item.id) {
    <div>{{ item.nombre }}</div>
  }
</section>
```

### 3. `<nombre>.component.css`

Vacío por defecto (preferir Tailwind en el template). Solo añade CSS si hay animaciones o estilos que Tailwind no puede manejar.

### 4. `<nombre>.component.spec.ts`

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { <NombreComponent> } from './<nombre>.component';

describe('<NombreComponent>', () => {
  let component: <NombreComponent>;
  let fixture: ComponentFixture<<NombreComponent>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        <NombreComponent>,
        TranslateModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(<NombreComponent>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  // Agrega tests para cada @Input, @Output y lógica de negocio
});
```

---

## Dónde colocar los archivos

| Tipo | Ruta |
|------|------|
| `ui` | `src/app/components/ui/<nombre>/` |
| `feature` | `src/app/features/<feature>/components/<nombre>/` |
| `layout` | `src/app/layout/<nombre>/` |
| Sin tipo | `src/app/components/<nombre>/` |

---

## Lista de verificación antes de entregar

- [ ] `standalone: true` en el decorador
- [ ] Inyección con `inject()`, no con constructor (salvo herencia)
- [ ] Sin `*ngIf`, `*ngFor` ni `*ngSwitch` en el template
- [ ] Todos los textos del template usan `| translate`
- [ ] Sin URLs hardcodeadas
- [ ] Sin acceso directo a `window`/`document`/`localStorage` sin protección SSR
- [ ] Archivo `.spec.ts` creado con al menos el test básico de creación
- [ ] Claves de traducción documentadas en un comentario o en el propio spec
