export interface CampaignCreateRequest {
  name: string;
  description?: string;
  startDate?: string; // ISO
  endDate?: string; // ISO
  categoryId?: string;
  businessId?: string;
}

export interface CampaignCreateResponse {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  createdAt?: string;
}

