export interface AbResBase<T = any> {
  resultCode: string;
  message?: string;
  data?: T;
}

export interface AbError {
  status: number;
  message: string;
  ip: string;
}

export interface AbReqBase<R = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  data?: R;
  md5?: string;
  date?: string;
}
