export enum UserRole {
  Reader,
  Contributer,
  Admin,
}

export interface Credential {
  email: string;
  password: string;
  userId: string;
  roles: UserRole[];
}

export const Credentials: Credential[] = [
  { email: 'a', password: 'a', userId: '6988d561-1742-4f0c-91cc-6919e1b983ed', roles: [UserRole.Reader] },
  { email: 'b', password: 'b', userId: '6988d561-1742-4f0c-91cc-6919e1b983f5', roles: [UserRole.Admin] },
];
