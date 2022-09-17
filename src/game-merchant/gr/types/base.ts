export interface GrResBase<T = any> {
  status: string;
  code: string;
  message: string;
  data: T;
}

export interface GrReqBase<R = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  data: R;
}
