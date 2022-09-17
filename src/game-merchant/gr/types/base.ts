export interface GrBaseRes<T> {
  status: string;
  code: string;
  message: string;
  data: T;
}

export interface GrReqBase {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  data: any;
}
