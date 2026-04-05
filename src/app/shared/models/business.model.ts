export interface BusinessCreateRequest {
  name: string,
  description: string,
  categoryId: string,
  userId: string,
  email: null,
  customerServiceEmail: null,
  orderManagementEmail: null,
  website: string
}

export interface BusinessCreateResponse {
  id: string,
  businessName: string,
  createdDate: string,
  updatedDate: string
}

export interface BusinessDetailResponse {
  id: string,
  name: string,
  description: string,
  userId: string,
  categoryId: string,
  email: string | null,
  customerServiceEmail: string | null,
  orderManagementEmail: string | null,
  website: string,
  createdDate: string,
  updatedDate: string
}

export interface BusinessUpdateRequest {
  name?: string;
  description?: string;
  categoryId?: string;
  email?: string | null;
  customerServiceEmail?: string | null;
  orderManagementEmail?: string | null;
  website?: string;
}
