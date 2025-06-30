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
