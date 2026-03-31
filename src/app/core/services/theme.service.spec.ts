import { TestBed } from '@angular/core/testing';
import { ThemeService, Theme } from './theme.service';
import { StorageMockService } from './storage-mock.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockStorage: jasmine.SpyObj<StorageMockService>;

  beforeEach(() => {
    mockStorage = jasmine.createSpyObj('StorageMockService', ['getLocal', 'setLocal', 'removeLocal']);
    mockStorage.getLocal.and.returnValue(null);

    // Mock matchMedia to always report light mode preference
    spyOn(window, 'matchMedia').and.returnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
      dispatchEvent: jasmine.createSpy('dispatchEvent'),
      onchange: null,
      addListener: jasmine.createSpy('addListener'),
      removeListener: jasmine.createSpy('removeListener'),
    } as unknown as MediaQueryList);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: StorageMockService, useValue: mockStorage }
      ]
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to light theme', () => {
    const theme = service.getCurrentTheme();
    expect(theme.name).toBe('light');
    expect(service.isDarkMode()).toBeFalse();
  });

  it('should return available themes', () => {
    const themes = service.getThemes();
    expect(themes.length).toBe(2);
    expect(themes[0].name).toBe('light');
    expect(themes[1].name).toBe('dark');
  });

  it('should set dark mode', () => {
    service.setDarkMode(true);
    expect(service.isDarkMode()).toBeTrue();
    expect(service.getCurrentTheme().name).toBe('dark');
    expect(mockStorage.setLocal).toHaveBeenCalledWith('app-theme', 'dark');
  });

  it('should set light mode', () => {
    service.setDarkMode(true);
    service.setDarkMode(false);
    expect(service.isDarkMode()).toBeFalse();
    expect(service.getCurrentTheme().name).toBe('light');
  });

  it('should toggle dark mode', () => {
    expect(service.isDarkMode()).toBeFalse();
    service.toggleDarkMode();
    expect(service.isDarkMode()).toBeTrue();
    service.toggleDarkMode();
    expect(service.isDarkMode()).toBeFalse();
  });

  it('should set a specific theme', () => {
    const darkTheme: Theme = { name: 'dark', displayName: 'Dark', className: 'dark-theme' };
    service.setTheme(darkTheme);

    expect(service.getCurrentTheme().name).toBe('dark');
    expect(service.isDarkMode()).toBeTrue();
    expect(mockStorage.setLocal).toHaveBeenCalledWith('app-theme', 'dark');
    expect(mockStorage.setLocal).toHaveBeenCalledWith('dark-mode', true);
  });

  it('should emit theme changes via currentTheme$', (done) => {
    const themes: Theme[] = [];
    service.currentTheme$.subscribe(theme => {
      themes.push(theme);
      if (themes.length === 2) {
        expect(themes[0].name).toBe('light');
        expect(themes[1].name).toBe('dark');
        done();
      }
    });
    service.setDarkMode(true);
  });

  it('should emit isDarkMode$ changes', (done) => {
    const values: boolean[] = [];
    service.isDarkMode$.subscribe(val => {
      values.push(val);
      if (values.length === 2) {
        expect(values[0]).toBeFalse();
        expect(values[1]).toBeTrue();
        done();
      }
    });
    service.setDarkMode(true);
  });

  it('should restore theme from stored theme name', () => {
    // Reset and reconfigure with stored theme
    mockStorage.getLocal.and.callFake(<T>(key: string): T | null => {
      if (key === 'app-theme') return 'dark' as unknown as T;
      return null;
    });

    // Create a new instance to test initialization
    const freshService = new ThemeService(mockStorage);
    expect(freshService.getCurrentTheme().name).toBe('dark');
    expect(freshService.isDarkMode()).toBeTrue();
  });
});
