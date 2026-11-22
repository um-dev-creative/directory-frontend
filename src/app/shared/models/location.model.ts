/**
 * Models of the cities catalogue, the locations (sedes) of a business and the business search.
 * They mirror the transfer objects of directory-backend (`CityTO`, `LocationTO`, `BusinessSearchResponse`).
 */

export interface City {
  id: string;
  name: string;
  province: string;
  /** ISO 3166-1 alpha-2 country code, e.g. `CA`. */
  country: string;
}

export interface Location {
  id: string;
  businessId: string;
  city: City;
  name: string | null;
  addressLine: string;
  postalCode: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  /** The main location of the business; a business always has exactly one when it has any. */
  main: boolean;
  createdAt: string;
  lastUpdate: string;
}

export interface LocationCreateRequest {
  cityId: string;
  name?: string | null;
  addressLine: string;
  postalCode?: string | null;
  phone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  main?: boolean;
}

/** Only the fields that are sent change. */
export type LocationUpdateRequest = Partial<LocationCreateRequest>;

export interface BusinessSearchItem {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  verified: boolean;
  profileImageRef: string | null;
  locations: Location[];
}

/** Filters of the business search; every field is optional. */
export interface BusinessSearchParams {
  cityId?: string | null;
  category?: string | null;
  q?: string | null;
  /** 1-based. */
  page?: number;
  perPage?: number;
}

export interface BusinessSearchResponse {
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
  data: BusinessSearchItem[];
}

/** Subset of the category listing the search filter needs. */
export interface CategoryOption {
  id: string;
  name: string;
}
