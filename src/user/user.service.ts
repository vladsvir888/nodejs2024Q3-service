import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User, UserWithoutPassword } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private messages = {
    NOT_FOUND: 'User is not found.',
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
    const users = await this.userRepository.find();
    return this.excludePassword(users);
  }

  async getById(id: string): Promise<UserWithoutPassword> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(this.messages.NOT_FOUND);
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
    await this.userRepository.save(newUser);

    return this.excludePassword([newUser])[0];
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    await this.userRepository.delete(id);
  }

  async update(
    id: string,
    data: UpdatePasswordDto,
  ): Promise<UserWithoutPassword> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    if (user.password !== data.oldPassword) {
      throw new ForbiddenException(this.messages.WRONG_PASSWORD);
    }

    const newUser = {
      ...user,
      createdAt: Number(user.createdAt),
      password: data.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };
    await this.userRepository.update(id, newUser);
    return this.excludePassword([newUser])[0];
  }
}
