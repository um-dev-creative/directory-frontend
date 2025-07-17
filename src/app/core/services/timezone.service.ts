import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Timezone, TIMEZONES } from '../../../assets/mocks/timezones.mock';

// Re-exportar el tipo para uso externo
export type { Timezone } from '../../../assets/mocks/timezones.mock';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {

  constructor() { }

  /**
   * Obtiene todas las zonas horarias disponibles
   * Simula una llamada HTTP con un delay de 200ms
   */
  getTimezones(): Observable<Timezone[]> {
    return of(TIMEZONES).pipe(
      delay(200) // Simula latencia de red
    );
  }

  /**
   * Obtiene una zona horaria específica por su valor
   * @param value El valor de la zona horaria a buscar
   */
  getTimezoneByValue(value: string): Observable<Timezone | undefined> {
    const timezone = TIMEZONES.find((tz: Timezone) => tz.value === value);
    return of(timezone).pipe(
      delay(100)
    );
  }

  /**
   * Busca zonas horarias que coincidan con un término de búsqueda
   * @param searchTerm Término de búsqueda para filtrar zonas horarias
   */
  searchTimezones(searchTerm: string): Observable<Timezone[]> {
    const filtered = TIMEZONES.filter((timezone: Timezone) =>
      timezone.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timezone.value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return of(filtered).pipe(
      delay(150)
    );
  }
}
