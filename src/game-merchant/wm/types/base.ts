export interface WmResBase<T = any> {
  errorCode: number;
  errorMessage: string;
  result: T;
}

export interface WmReqBase<R = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  data: R;
}
