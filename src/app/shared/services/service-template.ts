import {HttpErrorResponse} from "@angular/common/http";
import {throwError} from "rxjs";

export class ServiceTemplate {
  public handlerError(errorResponse: HttpErrorResponse | ErrorEvent): any {
    if (errorResponse instanceof ErrorEvent) {
      console.error(errorResponse);
    } else {
      console.error(`Code: ${errorResponse.status}, Message: Error: ${errorResponse.message}`);
    }
    return throwError(errorResponse);
  }

}
