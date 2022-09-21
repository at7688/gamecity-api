export interface OgResBase<T = any> {
  status: string;
  data?: T;
  meta?: any;
}
// export type OgRecordRes<T> = T[];

export interface OgReqBase<R = any> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  data?: R;
  headers?: any;
  params?: R;
}

export const OG_API_TOKEN = 'OG_API_TOKEN';
