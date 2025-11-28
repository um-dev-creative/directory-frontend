/**
 * Campaign models used across the frontend application.
 *
 * These interfaces describe the shape of data received from and sent to
 * the backend campaign endpoints. They are intentionally permissive where
 * the backend may return different field names or shapes (e.g. `uuid` vs
 * `id`, `validFrom` vs `startDate`). Clients should normalize values when
 * required.
 *
 * Notes:
 * - Date/time fields are represented as ISO strings here; components may
 *   convert them into `Date` objects for display or computation.
 * - `id` is declared as `UUID` to reflect backend semantics — the value is
 *   typically a hyphenated UUID string. Consumers may treat it as `string`.
 */
/**
 * Representation of a campaign record returned by the backend.
 *
 * Fields are optional when the backend may omit them. Consumers should
 * apply sensible defaults where necessary.
 *
 * @example
 * const c: Campaign = {
 *   id: '64d0648d-a3ff-4fa6-83e1-649cea48bc09',
 *   title: 'Black Friday Special',
 *   startDate: '2025-11-25T00:00:00',
 *   endDate: '2025-11-29T23:59:59',
 *   discount: 50
 * };
 */
export interface Campaign {
  /**
   * Campaign unique identifier (UUID string).
   */
  id: string;

  /**
   * Short, human-friendly title of the campaign.
   */
  title: string;

  /**
   * Optional long description or summary for the campaign.
   */
  description?: string;

  /**
   * ISO date/time string marking the start of the campaign.
   * Example: '2025-11-25T00:00:00'
   */
  startDate?: string | null;

  /**
   * ISO date/time string marking the end of the campaign.
   * Example: '2025-12-31T23:59:34'
   */
  endDate?: string | null;

  /**
   * Identifier of the category associated with this campaign (if any).
   * Use `categoryId` to look up category metadata in category services.
   */
  categoryId?: string | null;

  /**
   * Optional id of the business that owns this campaign.
   */
  businessId?: string;

  /**
   * Boolean flag indicating if the campaign is active.
   */
  active?: boolean;

  /**
   * Optional human-readable category name returned for convenience.
   */
  categoryName?: string | null;

  /**
   * Numeric discount value. Interpretation (percentage vs absolute)
   * depends on the backend contract; the UI should know how to display it.
   */
  discount?: number;

  /**
   * Optional status value (commonly 'ACTIVE', 'EXPIRED', 'INACTIVE').
   * Clients should normalize this to their local enums before use.
   */
  status?: string | null;

  /**
   * Optional terms and conditions associated with the campaign.
   */
  terms?: string | null;
}

/**
 * Normalized paginated response used by the frontend when listing campaigns.
 *
 * This mirrors common backend structures but uses frontend-friendly names
 * and types. `items` contains an array of normalized `Campaign` objects.
 */
export interface PaginatedCampaigns {
  /** Campaign items for the current page. */
  items: Campaign[];
  /** Total number of campaigns available across all pages. */
  total_count: number;
  /** Current page number (1-based). */
  page: number;
  /** Number of items per page (page size). */
  per_page: number;
  /** Total pages available for the current page size. */
  total_pages: number;
}

/**
 * Payload used to create a new campaign.
 *
 * Fields should conform to the backend contract; properties omitted here
 * will be treated as optional by the backend if supported.
 */
export interface CampaignCreateRequest {
  /** Campaign title/name. */
  title: string;
  /** Optional long description. */
  description?: string;
  /** Optional ISO start date string. */
  startDate?: string; // ISO
  /** Optional ISO end date string. */
  endDate?: string; // ISO
  /** Optional category id to associate with the campaign. */
  categoryId?: string;
  /** Optional business id to associate the campaign with a business. */
  businessId?: string;
  /** Optional numeric discount value. */
  discount?: number;
  /** Optional numeric budget for the campaign. */
  terms?: string;
  /** Optional status value (e.g. 'ACTIVE', 'EXPIRED', 'INACTIVE'). */
  status?: string;
  /** Optional boolean flag indicating if the campaign is active. */
  active?: boolean;
}

/**
 * Response returned by the backend after successfully creating a campaign.
 * Contains identifying information for the newly-created campaign and
 * may include additional metadata depending on backend implementation.
 */
export interface CampaignCreateResponse {
  /** Newly created campaign identifier. */
  id: string;
  /** Title of the created campaign (echoed back). */
  title: string;
  /** Optional description echoed back from the creation request. */
  description?: string;
  /** Optional ISO start date/time assigned to the campaign. */
  startDate?: string;
  /** Optional ISO end date/time assigned to the campaign. */
  endDate?: string;
  /** Optional numeric budget field returned by some backends. */
  budget?: number;
  /** Optional server timestamp when the campaign was created. */
  createdAt?: string;
}
