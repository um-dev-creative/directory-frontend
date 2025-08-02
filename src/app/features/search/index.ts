// Componente principal de búsqueda
export { Search } from './search';

// Componente de ejemplo de uso
export { SearchUsageExampleComponent } from './search-usage-example';

// Tipos y interfaces (para futuras expansiones)
export interface SearchConfig {
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  maxLength?: number;
  minLength?: number;
}

export interface SearchResult {
  query: string;
  results: any[];
  total: number;
  timestamp: Date;
}

export interface SearchEvent {
  type: 'change' | 'submit' | 'clear';
  query: string;
  timestamp: Date;
}
