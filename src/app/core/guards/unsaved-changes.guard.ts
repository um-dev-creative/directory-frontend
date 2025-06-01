import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {

  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean> | Promise<boolean> | boolean {

    if (component.canDeactivate) {
      return component.canDeactivate();
    }

    return true;
  }
}

// Helper component base class
export abstract class UnsavedChangesComponent implements CanComponentDeactivate {
  protected hasUnsavedChanges = false;

  canDeactivate(): boolean {
    if (this.hasUnsavedChanges) {
      return confirm('You have unsaved changes. Are you sure you want to leave?');
    }
    return true;
  }

  protected markAsChanged(): void {
    this.hasUnsavedChanges = true;
  }

  protected markAsSaved(): void {
    this.hasUnsavedChanges = false;
  }
}
