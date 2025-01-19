import {Injectable, signal, Signal} from '@angular/core';
import {HeaderType} from '@shared/constants/header-type';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private readonly _headerType: BehaviorSubject<HeaderType> = new BehaviorSubject<HeaderType>(HeaderType.MINIMAL_HEADER);
  readonly headerType$: Observable<HeaderType> = this._headerType.asObservable();

  constructor() { }


  setHeaderType(headerType: HeaderType) {
    this._headerType.next(headerType);
  }
}
