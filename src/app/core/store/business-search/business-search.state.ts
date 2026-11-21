import {BusinessSearchItem, BusinessSearchParams, City} from '@shared/models/location.model';

export interface BusinessSearchState {
  /** The filters of the last search that was requested. */
  params: BusinessSearchParams;
  results: BusinessSearchItem[];
  totalCount: number;
  /** 1-based page of the results. */
  page: number;
  perPage: number;
  totalPages: number;
  isSearching: boolean;
  searchError: string | null;
  /** Cities catalogue for the city filter. */
  cities: City[];
  isLoadingCities: boolean;
  citiesError: string | null;
}

export const initialBusinessSearchState: BusinessSearchState = {
  params: {},
  results: [],
  totalCount: 0,
  page: 1,
  perPage: 10,
  totalPages: 0,
  isSearching: false,
  searchError: null,
  cities: [],
  isLoadingCities: false,
  citiesError: null
};
