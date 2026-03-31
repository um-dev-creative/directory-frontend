import { TestBed } from '@angular/core/testing';
import { CampaignMapper } from './campaign-mapper.service';
import { OfferStatus } from '@app/features/partner/components/settings/offers';

describe('CampaignMapper', () => {
  let mapper: CampaignMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CampaignMapper]
    });
    mapper = TestBed.inject(CampaignMapper);
  });

  it('should be created', () => {
    expect(mapper).toBeTruthy();
  });

  describe('mapToCampaign', () => {
    it('should map a standard DTO to Campaign', () => {
      const dto = {
        id: '123',
        title: 'Summer Sale',
        description: 'Big discounts',
        categoryId: 'cat-1',
        categoryName: 'Electronics',
        startDate: '2025-06-01',
        endDate: '2025-06-30',
        discount: 20,
        status: 'ACTIVE',
        terms: 'Terms apply'
      };

      const result = mapper.mapToCampaign(dto);

      expect(result.id).toBe('123');
      expect(result.title).toBe('Summer Sale');
      expect(result.description).toBe('Big discounts');
      expect(result.categoryId).toBe('cat-1');
      expect(result.discount).toBe(20);
      expect(result.status).toBe('ACTIVE');
    });

    it('should use fallback field names (uuid, summary, validFrom, validUntil)', () => {
      const dto = {
        uuid: 'abc-uuid',
        title: 'Test',
        summary: 'A summary',
        category: 'cat-2',
        validFrom: '2025-01-01',
        validUntil: '2025-12-31'
      };

      const result = mapper.mapToCampaign(dto);

      expect(result.id).toBe('abc-uuid');
      expect(result.description).toBe('A summary');
      expect(result.categoryId).toBe('cat-2');
      expect(result.startDate).toBe('2025-01-01');
      expect(result.endDate).toBe('2025-12-31');
    });

    it('should handle null/undefined input', () => {
      const result = mapper.mapToCampaign(null);

      expect(result.id).toBe('');
      expect(result.title).toBe('');
      expect(result.description).toBe('');
      expect(result.discount).toBe(0);
    });

    it('should handle empty object', () => {
      const result = mapper.mapToCampaign({});

      expect(result.id).toBe('');
      expect(result.title).toBe('');
    });

    it('should convert id to string', () => {
      const dto = { id: 42, title: 'Numeric ID' };
      const result = mapper.mapToCampaign(dto);

      expect(result.id).toBe('42');
    });

    it('should convert discount to number', () => {
      const dto = { id: '1', title: 'Test', discount: '15' };
      const result = mapper.mapToCampaign(dto);

      expect(result.discount).toBe(15);
    });

    it('should use desc as fallback for description', () => {
      const dto = { id: '1', title: 'Test', desc: 'A desc' };
      const result = mapper.mapToCampaign(dto);

      expect(result.description).toBe('A desc');
    });

    it('should use state as fallback for status', () => {
      const dto = { id: '1', title: 'Test', state: 'EXPIRED' };
      const result = mapper.mapToCampaign(dto);

      expect(result.status).toBe('EXPIRED');
    });
  });

  describe('mapCampaignToOffer', () => {
    const baseCampaign = {
      id: 'camp-1',
      title: 'Offer Title',
      description: 'Offer Description',
      discount: 10,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      status: 'ACTIVE',
      categoryId: 'cat-1',
      categoryName: 'Food',
      terms: 'Some terms'
    };

    it('should map a campaign to an Offer', () => {
      const result = mapper.mapCampaignToOffer(baseCampaign as any);

      expect(result.id).toBe('camp-1');
      expect(result.title).toBe('Offer Title');
      expect(result.description).toBe('Offer Description');
      expect(result.discount).toBe(10);
      expect(result.status).toBe(OfferStatus.ACTIVE);
      expect(result.categoryId).toBe('cat-1');
      expect(result.categoryName).toBe('Food');
      expect(result.terms).toBe('Some terms');
    });

    it('should set _id from index option', () => {
      const result = mapper.mapCampaignToOffer(baseCampaign as any, { index: 5 });

      expect(result._id).toBe(5);
    });

    it('should default _id to 0 when no index provided', () => {
      const result = mapper.mapCampaignToOffer(baseCampaign as any);

      expect(result._id).toBe(0);
    });

    it('should normalize status to OfferStatus.INACTIVE for unknown values', () => {
      const campaign = { ...baseCampaign, status: 'UNKNOWN' };
      const result = mapper.mapCampaignToOffer(campaign as any);

      expect(result.status).toBe(OfferStatus.INACTIVE);
    });

    it('should normalize status to OfferStatus.EXPIRED', () => {
      const campaign = { ...baseCampaign, status: 'expired' };
      const result = mapper.mapCampaignToOffer(campaign as any);

      expect(result.status).toBe(OfferStatus.EXPIRED);
    });

    it('should create validUntil date from endDate', () => {
      const result = mapper.mapCampaignToOffer(baseCampaign as any);

      expect(result.validUntil instanceof Date).toBeTrue();
    });

    it('should create createdAt date from startDate', () => {
      const result = mapper.mapCampaignToOffer(baseCampaign as any);

      expect(result.createdAt instanceof Date).toBeTrue();
    });

    it('should handle campaign with no endDate', () => {
      const campaign = { ...baseCampaign, endDate: null };
      const result = mapper.mapCampaignToOffer(campaign as any);

      expect(result.validUntil instanceof Date).toBeTrue();
    });
  });

  describe('mapToCampaignCreateRequest', () => {
    it('should map an Offer to CampaignCreateRequest', () => {
      const offer = {
        title: 'New Offer',
        description: 'Desc',
        discount: 25,
        validUntil: new Date(2025, 11, 31),
        categoryId: 'cat-1',
        terms: 'Terms',
        status: OfferStatus.ACTIVE
      };

      const result = mapper.mapToCampaignCreateRequest(offer as any, 'biz-123');

      expect(result.title).toBe('New Offer');
      expect(result.description).toBe('Desc');
      expect(result.discount).toBe(25);
      expect(result.businessId).toBe('biz-123');
      expect(result.categoryId).toBe('cat-1');
      expect(result.terms).toBe('Terms');
      expect(result.active).toBeTrue();
    });

    it('should set startDate to today formatted', () => {
      const offer = { title: 'Test' };
      const result = mapper.mapToCampaignCreateRequest(offer as any, 'biz-1');

      expect(result.startDate).toBeDefined();
      expect(result.startDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    });

    it('should format endDate from validUntil', () => {
      const offer = { title: 'Test', validUntil: new Date(2025, 5, 15) };
      const result = mapper.mapToCampaignCreateRequest(offer as any, 'biz-1');

      expect(result.endDate).toBe('2025-06-15T00:00:00');
    });
  });
});
