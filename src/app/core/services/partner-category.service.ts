import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { PartnerCategory, PARTNER_CATEGORIES } from '../../../assets/mocks/partner-categories.mock';

// Re-exportar el tipo para uso externo
export type { PartnerCategory } from '../../../assets/mocks/partner-categories.mock';

@Injectable({
  providedIn: 'root'
})
export class PartnerCategoryService {

  constructor() { }

  /**
   * Obtiene todas las categorías de partners disponibles
   * Simula una llamada HTTP con un delay de 300ms
   */
  getCategories(): Observable<PartnerCategory[]> {
    return of(PARTNER_CATEGORIES).pipe(
      delay(300) // Simula latencia de red
    );
  }

  /**
   * Obtiene una categoría específica por su valor
   * @param value El valor de la categoría a buscar
   */
  getCategoryByValue(value: string): Observable<PartnerCategory | undefined> {
    const category = PARTNER_CATEGORIES.find((cat: PartnerCategory) => cat.value === value);
    return of(category).pipe(
      delay(100)
    );
  }

  /**
   * Busca categorías que coincidan con un término de búsqueda
   * @param searchTerm Término de búsqueda para filtrar categorías
   */
  searchCategories(searchTerm: string): Observable<PartnerCategory[]> {
    const filtered = PARTNER_CATEGORIES.filter((category: PartnerCategory) =>
      category.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return of(filtered).pipe(
      delay(200)
    );
  }
}
