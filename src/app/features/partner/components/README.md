# Partner Components

Esta carpeta contiene todos los componentes relacionados con la funcionalidad de partners.

## Estructura

```
components/
├── index.ts                               # Exportaciones principales
├── partner-registration-stepper.component.ts  # Componente principal de registro
├── partner-settings.component.*          # Componente principal de configuración
├── registration/                          # Componentes de registro (para futura expansión)
├── settings/                             # Componentes de configuración
│   ├── general/                          # Configuración general
│   │   ├── index.ts
│   │   ├── partner-general-settings.component.ts
│   │   ├── partner-general-settings.component.html
│   │   └── partner-general-settings.component.css
│   ├── offers/                           # Configuración de ofertas
│   │   ├── index.ts
│   │   └── partner-offers-settings.component.ts
│   ├── products/                         # Configuración de productos
│   │   ├── index.ts
│   │   └── partner-products-settings.component.ts
│   └── index.ts                          # Exportaciones de settings
└── steps/                                # Pasos del registro
    ├── index.ts
    ├── partner-step-one.component.ts
    ├── partner-step-two.component.ts
    └── partner-step-three.component.ts
```

## Importaciones

### Componentes principales
```typescript
import { 
  PartnerRegistrationStepperComponent,
  PartnerSettingsComponent
} from '@app/features/partner/components';
```

### Componentes de configuración
```typescript
import { 
  PartnerGeneralSettingsComponent,
  PartnerOffersSettingsComponent,
  PartnerProductsSettingsComponent
} from '@app/features/partner/components';
```

### Pasos de registro
```typescript
import { 
  PartnerStepOneComponent,
  PartnerStepTwoComponent,
  PartnerStepThreeComponent
} from '@app/features/partner/components';
```

## Beneficios de esta estructura

1. **Organización clara**: Los componentes están agrupados por funcionalidad
2. **Escalabilidad**: Fácil agregar nuevos componentes de configuración
3. **Mantenibilidad**: Cada componente está en su propio directorio con sus archivos relacionados
4. **Importaciones limpias**: Un solo punto de entrada para importar todos los componentes
5. **Separación de responsabilidades**: Configuración, registro y pasos están separados

## Rutas asociadas

- `/partner/settings` - Componente principal de configuración
- `/partner/settings/general` - Configuración general
- `/partner/settings/offers` - Configuración de ofertas
- `/partner/settings/products` - Configuración de productos
- `/partner/register` - Stepper de registro
