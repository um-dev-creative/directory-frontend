import { TestBed } from '@angular/core/testing';
import { UnsavedChangesGuard, CanComponentDeactivate, UnsavedChangesComponent } from './unsaved-changes.guard';
import { Observable, of } from 'rxjs';

describe('UnsavedChangesGuard', () => {
  let guard: UnsavedChangesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnsavedChangesGuard]
    });
    guard = TestBed.inject(UnsavedChangesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow deactivation when component has no canDeactivate method', () => {
    const component = {} as CanComponentDeactivate;
    const result = guard.canDeactivate(component);
    expect(result).toBeTrue();
  });

  it('should allow deactivation when component returns true', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: () => true
    };
    const result = guard.canDeactivate(component);
    expect(result).toBeTrue();
  });

  it('should block deactivation when component returns false', () => {
    const component: CanComponentDeactivate = {
      canDeactivate: () => false
    };
    const result = guard.canDeactivate(component);
    expect(result).toBeFalse();
  });

  it('should handle component returning an Observable', (done) => {
    const component: CanComponentDeactivate = {
      canDeactivate: () => of(true)
    };
    const result = guard.canDeactivate(component);
    if (result instanceof Observable) {
      result.subscribe(val => {
        expect(val).toBeTrue();
        done();
      });
    }
  });

  it('should handle component returning a Promise', async () => {
    const component: CanComponentDeactivate = {
      canDeactivate: () => Promise.resolve(false)
    };
    const result = guard.canDeactivate(component);
    if (result instanceof Promise) {
      const val = await result;
      expect(val).toBeFalse();
    }
  });
});

describe('UnsavedChangesComponent', () => {
  // Concrete implementation for testing the abstract class
  class TestComponent extends UnsavedChangesComponent {
    public setChanged() { this.markAsChanged(); }
    public setSaved() { this.markAsSaved(); }
  }

  let component: TestComponent;

  beforeEach(() => {
    component = new TestComponent();
  });

  it('should allow deactivation when there are no unsaved changes', () => {
    expect(component.canDeactivate()).toBeTrue();
  });

  it('should prompt confirmation when there are unsaved changes', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.setChanged();
    const result = component.canDeactivate();
    expect(window.confirm).toHaveBeenCalledWith('You have unsaved changes. Are you sure you want to leave?');
    expect(result).toBeTrue();
  });

  it('should block deactivation when user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.setChanged();
    expect(component.canDeactivate()).toBeFalse();
  });

  it('should allow deactivation after marking as saved', () => {
    component.setChanged();
    component.setSaved();
    expect(component.canDeactivate()).toBeTrue();
  });
});
