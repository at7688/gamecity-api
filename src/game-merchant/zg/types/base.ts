export interface ZgResBase<T = any> {
  status: string;
  code: string;
  message: string;
  data: T;
}

export interface ZgReqBase<R = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  data: R;
}
