export interface SimpleMember {
  id: string;
  username: string;
  nickname: string;
  subs?: SimpleMember[];
}
