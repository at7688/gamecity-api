export interface BwinResBase<T = any> {
  error?: BwinError;
  data?: T;
  totalSize?: number;
}

export interface BwinError {
  status: number;
  message: string;
  ip: string;
}

export interface BwinReqBase<R = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  data?: R;
}
