import { UserDto } from '../assets/users';
import { usersData } from '../assets/users';

export function getUsers(): UserDto[] {
  return usersData;
}

export function getUsersAsync(): Promise<UserDto[]> {
  return Promise.resolve(getUsers());
}

export function getUserByIdAsync(id: string): Promise<UserDto | undefined> {
  return Promise.resolve(getUsers().find((user) => user.id === id));
}
