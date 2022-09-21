export interface OgResBase<T = any> {
  error?: OgError;
  data?: T;
  totalSize?: number;
}

export interface OgError {
  status: number;
  message: string;
  ip: string;
}

export interface OgReqBase<R = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  data?: R;
}
