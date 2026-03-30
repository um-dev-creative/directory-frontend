import { Footer } from './footer';

describe('Footer', () => {
  let footer: Footer;

  beforeEach(() => {
    footer = new Footer();
  });

  it('should create an instance', () => {
    expect(footer).toBeTruthy();
  });

  it('should have autor property with nombre', () => {
    expect(footer.autor.nombre).toBe('Luis');
  });

  it('should have autor property with apellido', () => {
    expect(footer.autor.apellido).toBe('Mata');
  });

  it('should have autor property with company', () => {
    expect(footer.autor.company).toBe('UM Dev Creative');
  });

  it('should have current year', () => {
    expect(footer.autor.year).toBe(new Date().getFullYear());
  });
});
