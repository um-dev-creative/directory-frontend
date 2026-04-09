import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderMenu, UserLogger } from './header-menu';
import { HeaderType } from '@shared/constants/header-type';

const DEFAULT_USER: UserLogger = {
  alias: '@testuser',
  fullName: 'Test User',
  displayName: 'Test User',
  avatarUrl: '',
  initials: 'TU'
};

describe('HeaderMenu', () => {
  let component: HeaderMenu;
  let fixture: ComponentFixture<HeaderMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderMenu,
        RouterTestingModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderMenu);
    component = fixture.componentInstance;
    component.headerType = HeaderType.GENERAL_HEADER;
    component.userLogger = { ...DEFAULT_USER };
    component.hasBusiness = false;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('isOpen = false (drawer fuera de pantalla)', () => {
    beforeEach(() => {
      component.isOpen = false;
      fixture.detectChanges();
    });

    it('el drawer no debería tener la clase translate-x-0', () => {
      const drawer = fixture.debugElement.query(
        By.css('.fixed.inset-y-0.right-0')
      );
      expect(drawer.nativeElement.classList).not.toContain('translate-x-0');
    });

    it('el overlay no debería renderizarse', () => {
      const overlay = fixture.debugElement.query(
        By.css('.fixed.inset-0.bg-black\\/50')
      );
      expect(overlay).toBeNull();
    });
  });

  describe('isOpen = true (drawer visible)', () => {
    beforeEach(() => {
      component.isOpen = true;
      fixture.detectChanges();
    });

    it('el drawer debería tener la clase translate-x-0', () => {
      const drawer = fixture.debugElement.query(
        By.css('.fixed.inset-y-0.right-0')
      );
      expect(drawer.nativeElement.classList).toContain('translate-x-0');
    });

    it('el overlay debería renderizarse', () => {
      const overlay = fixture.debugElement.query(
        By.css('.fixed.inset-0')
      );
      expect(overlay).not.toBeNull();
    });
  });

  describe('Output closeMenu', () => {
    beforeEach(() => {
      component.isOpen = true;
      fixture.detectChanges();
    });

    it('debería emitir closeMenu al hacer click en el botón de cerrar', () => {
      let emitted = false;
      component.closeMenu.subscribe(() => (emitted = true));

      const closeBtn = fixture.debugElement.query(
        By.css('button .sr-only')
      )?.parent;
      closeBtn?.nativeElement.click();
      fixture.detectChanges();

      expect(emitted).toBeTrue();
    });

    it('debería emitir closeMenu al hacer click en el overlay', () => {
      let emitted = false;
      component.closeMenu.subscribe(() => (emitted = true));

      const overlay = fixture.debugElement.query(By.css('.fixed.inset-0'));
      overlay?.nativeElement.click();
      fixture.detectChanges();

      expect(emitted).toBeTrue();
    });
  });

  describe('Output logoutRequested', () => {
    beforeEach(() => {
      component.isOpen = true;
      component.headerType = HeaderType.USER_AUTH_HEADER;
      component.hasBusiness = false;
      fixture.detectChanges();
    });

    it('debería emitir logoutRequested al hacer click en el enlace de logout', () => {
      let emitted = false;
      component.logoutRequested.subscribe(() => (emitted = true));

      // El enlace de logout tiene la clase text-coral-700
      const logoutLink = fixture.debugElement.query(
        By.css('a.text-coral-700')
      );
      logoutLink?.nativeElement.click();
      fixture.detectChanges();

      expect(emitted).toBeTrue();
    });
  });

  describe('isPartnerMenuOpen signal', () => {
    it('debería inicializarse en false', () => {
      expect(component['isPartnerMenuOpen']()).toBeFalse();
    });

    it('debería cambiar a true al llamar openPartnerSubmenu(true)', () => {
      component['openPartnerSubmenu'](true);
      expect(component['isPartnerMenuOpen']()).toBeTrue();
    });

    it('debería volver a false al llamar openPartnerSubmenu(false)', () => {
      component['openPartnerSubmenu'](true);
      component['openPartnerSubmenu'](false);
      expect(component['isPartnerMenuOpen']()).toBeFalse();
    });

    it('onSubMenuClick con action=partner debería abrir el submenú', () => {
      const event = new MouseEvent('click');
      spyOn(event, 'preventDefault');
      component['onSubMenuClick'](event, 'partner');
      expect(component['isPartnerMenuOpen']()).toBeTrue();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('onSubMenuClick con action=back debería cerrar el submenú', () => {
      component['openPartnerSubmenu'](true);
      const event = new MouseEvent('click');
      spyOn(event, 'preventDefault');
      component['onSubMenuClick'](event, 'back');
      expect(component['isPartnerMenuOpen']()).toBeFalse();
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });
});
