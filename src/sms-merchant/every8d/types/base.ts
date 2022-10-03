export interface Every8dResBase<T = any> {
  Result: boolean;
  Status?: string;
  Msg: string;
}

export interface Every8dReqBase<R = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  data?: R;
  form?: R;
}

export const EVERY8D_TOKEN = 'EVERY8D_TOKEN';
