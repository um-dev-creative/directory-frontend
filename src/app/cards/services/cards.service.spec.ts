import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CardsService, CardImage as Image } from './cards.service';

describe('CardsService', () => {
  let service: CardsService;
  let httpMock: HttpTestingController;

  const mockCardsData = {
    images: [
      {
        id: 'test1',
        src: 'https://example.com/image1.jpg',
        alt: 'Test Image 1',
        title: 'Test Card 1',
        description: 'Test Description 1'
      },
      {
        id: 'test2',
        src: 'https://example.com/image2.jpg',
        alt: 'Test Image 2',
        title: 'Test Card 2',
        description: 'Test Description 2'
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CardsService]
    });
    service = TestBed.inject(CardsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch cards successfully', () => {
    service.getCards().subscribe((cards: Image[]) => {
      expect(cards).toEqual(mockCardsData.images);
      expect(cards.length).toBe(2);
      expect(cards[0].title).toBe('Test Card 1');
    });

    const req = httpMock.expectOne('assets/mocks/images.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockCardsData);
  });

  it('should handle empty response', () => {
    const emptyResponse = { images: [] };

    service.getCards().subscribe((cards: Image[]) => {
      expect(cards).toEqual([]);
      expect(cards.length).toBe(0);
    });

    const req = httpMock.expectOne('assets/mocks/images.json');
    req.flush(emptyResponse);
  });

  it('should handle malformed response', () => {
    const malformedResponse = { data: [] }; // Wrong structure

    service.getCards().subscribe((cards: Image[]) => {
      expect(cards).toEqual([]);
    });

    const req = httpMock.expectOne('assets/mocks/images.json');
    req.flush(malformedResponse);
  });

  it('should handle HTTP error', () => {
    service.getCards().subscribe({
      next: () => fail('Expected an error'),
      error: (error) => {
        expect(error.message).toEqual('Server error - please try again later');
      }
    });

    // Should retry 2 times, so we need to respond to 3 requests total
    for (let i = 0; i < 3; i++) {
      const req = httpMock.expectOne('assets/mocks/images.json');
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    }
  });

  it('should handle network error', () => {
    service.getCards().subscribe({
      next: () => fail('Expected an error'),
      error: (error) => {
        expect(error.message).toEqual('Network error - please check your connection');
      }
    });

    // Should retry 2 times, so we need to respond to 3 requests total
    for (let i = 0; i < 3; i++) {
      const req = httpMock.expectOne('assets/mocks/images.json');
      req.flush('Error', { status: 0, statusText: 'Network Error' });
    }
  });

  it('should cache requests', () => {
    // First call
    service.getCards().subscribe();
    // Second call should use cache
    service.getCards().subscribe();

    // Should only make one HTTP request due to caching
    const req = httpMock.expectOne('assets/mocks/images.json');
    req.flush(mockCardsData);
  });

  it('should clear cache when requested', () => {
    // First call
    service.getCards().subscribe();
    const req1 = httpMock.expectOne('assets/mocks/images.json');
    req1.flush(mockCardsData);

    // Clear cache
    service.clearCache();

    // Second call should make new HTTP request
    service.getCards().subscribe();
    const req2 = httpMock.expectOne('assets/mocks/images.json');
    req2.flush(mockCardsData);
  });

  it('should retry failed requests', () => {
    service.getCards().subscribe({
      next: () => fail('Expected an error'),
      error: (error) => {
        expect(error.message).toEqual('Server error - please try again later');
      }
    });

    // Should retry 2 times before failing (total 3 requests)
    for (let i = 0; i < 3; i++) {
      const req = httpMock.expectOne('assets/mocks/images.json');
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    }
  });
});
