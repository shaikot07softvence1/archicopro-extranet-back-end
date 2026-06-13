export class UserInfoJwt {
  sub!: string;
  email!: string;
  role!: Role;
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}
