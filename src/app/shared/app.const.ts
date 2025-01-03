import { HttpHeaders } from '@angular/common/http';

export const DIRECTORY_BACKEND_SERVICE_BASE_URL = '/api/v1';
export const BACKBONE_SERVICE_BASE_URL = 'backbone/api';
export const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

export const HTTP_OPTIONS_STANDARD = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'responseType': 'arraybuffer'
  })
};

export const HTTP_OPTIONS_STANDARD_FILE = {
  headers: new HttpHeaders({
    'Content-Type': 'application/octet-stream',
    'Access-Control-Allow-Origin': '*',
    'responseType': 'arraybuffer',
    'Accept': 'application/octet-stream'
  })
};

export const HTTP_OPTIONS_TOKEN = function (token: string) {
  return {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'session-token-bkd': token,
      'Access-Control-Allow-Origin': '*'
    })
  };
}
// tslint:disable-next-line:no-namespace
export namespace AppConstants {
}
