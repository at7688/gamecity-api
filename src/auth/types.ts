export interface JwtParams {
  username: string;
  sub: string;
  platform: string;
  iat: number;
  exp: number;
}
