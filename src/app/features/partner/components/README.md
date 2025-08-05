# Partner Components

Esta carpeta contiene todos los componentes relacionados con la funcionalidad de partners, organizados en una estructura lógica y escalable.

## Estructura

```
components/
├── index.ts                               # Exportaciones principales
├── registration/                          # Todo lo relacionado con registro
│   ├── index.ts                          # Exportaciones de registro
│   ├── partner-registration-stepper.ts  # Componente principal de registro
│   └── steps/                            # Pasos del proceso de registro
│       ├── index.ts
│       ├── partner-step-one.ts
│       ├── partner-step-two.ts
│       └── partner-step-three.ts
└── settings/                             # Todo lo relacionado con configuraciones
    ├── index.ts                          # Exportaciones de settings
    ├── partner-settings.ts              # Componente principal de configuración
    ├── partner-settings.html            # Template del componente principal
    ├── partner-settings.css             # Estilos del componente principal
    ├── general/                          # Configuración general del partner
    │   ├── index.ts
    │   ├── partner-general-settings.ts
    │   ├── partner-general-settings.html
    │   └── partner-general-settings.css
    ├── locations/                        # Configuración de ubicaciones
    ├── offers/                           # Configuración de ofertas
    │   ├── index.ts
    │   └── partner-offers-settings.ts
    └── products/                         # Configuración de productos
        ├── index.ts
        └── partner-products-settings.component.ts
```

## Importaciones

### Componentes de registro
```typescript
import { 
  PartnerRegistrationStepper
} from '@app/features/partner/components';

// O específicamente desde registration
import { 
  PartnerRegistrationStepper,
  PartnerStepOne,
  PartnerStepTwo,
  PartnerStepThree
} from '@app/features/partner/components/registration';
```

### Componentes de configuración
```typescript
import { 
  PartnerSettings,
  PartnerGeneralSettings,
  PartnerOffersSettings,
  PartnerProductsSettings
} from '@app/features/partner/components';

// O específicamente desde settings
import { 
  PartnerSettings,
  PartnerGeneralSettings,
  PartnerOffersSettings,
  PartnerProductsSettings
} from '@app/features/partner/components/settings';
```

### Importación de todo
```typescript
// Importar todos los componentes de una vez
import * as PartnerComponents from '@app/features/partner/components';
```

## Beneficios de esta estructura

1. **🎯 Organización lógica**: Los componentes están agrupados por funcionalidad (registro vs configuraciones)
2. **📁 Eliminación de redundancias**: No hay directorios innecesarios ni re-exportaciones complejas
3. **🔍 Navegación mejorada**: Es fácil encontrar componentes relacionados en su contexto
4. **📈 Escalabilidad**: Fácil agregar nuevos componentes de registro o configuración
5. **🛠️ Mantenibilidad**: Cada componente principal está en su directorio temático con archivos relacionados
6. **🔗 Importaciones flexibles**: Múltiples formas de importar según las necesidades
7. **🧹 Limpieza**: Estructura clara sin archivos sueltos en el directorio raíz

## Rutas asociadas

### Configuraciones
- `/partner/settings` - Vista principal de configuración (PartnerSettings)
- `/partner/settings/general` - Configuración general del partner
- `/partner/settings/offers` - Gestión de ofertas
- `/partner/settings/products` - Gestión de productos
- `/partner/settings/locations` - Gestión de ubicaciones

### Registro
- `/partner/register` - Proceso de registro con stepper
- `/partner/register/step-1` - Primer paso del registro
- `/partner/register/step-2` - Segundo paso del registro
- `/partner/register/step-3` - Tercer paso del registro

## Migración desde la estructura anterior

Si tienes imports de la estructura anterior, estos siguen funcionando gracias a los archivos `index.ts`:

```typescript
// ✅ Estos imports siguen funcionando
import { PartnerRegistrationStepper } from '@app/features/partner/components';
import { PartnerSettings } from '@app/features/partner/components';
import { PartnerStepOne } from '@app/features/partner/components';
```

La nueva estructura es completamente compatible con los imports existentes.
