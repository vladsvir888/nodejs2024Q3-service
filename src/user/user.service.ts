import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User, UserWithoutPassword } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  private users: User[] = [];

  private messages = {
    USER_NOT_FOUND: 'User is not found.',
    WRONG_PASSWORD: 'User old password is wrong.',
  };

  private excludePassword(users: User[]): UserWithoutPassword[] {
    return users.map(({ login, id, createdAt, updatedAt, version }) => ({
      login,
      id,
      createdAt,
      updatedAt,
      version,
    }));
  }

  async getAll(): Promise<UserWithoutPassword[]> {
    return this.excludePassword(this.users);
  }

  async getById(id: string): Promise<UserWithoutPassword> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(this.messages.USER_NOT_FOUND);
    }

    return this.excludePassword([user])[0];
  }

  async create(user: CreateUserDto): Promise<UserWithoutPassword> {
    const newUser = {
      ...user,
      id: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    };
    this.users.push(newUser);

    return this.excludePassword([newUser])[0];
  }

  async delete(id: string): Promise<void> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(this.messages.USER_NOT_FOUND);
    }

    this.users = this.users.filter((user) => user.id !== id);
  }

  async update(
    id: string,
    data: UpdatePasswordDto,
  ): Promise<UserWithoutPassword> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(this.messages.USER_NOT_FOUND);
    }

    if (user.password !== data.oldPassword) {
      throw new ForbiddenException(this.messages.WRONG_PASSWORD);
    }

    const userIndex = this.users.indexOf(user);
    const newUser = {
      ...user,
      password: data.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };
    this.users.splice(userIndex, 1, newUser);

    return this.excludePassword([newUser])[0];
  }
}
