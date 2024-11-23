import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserWithoutPassword } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private messages = {
    user: 'User is not found.',
    password: 'Passwords do not match.',
  };

  async signUp(user: CreateUserDto): Promise<UserWithoutPassword> {
    return await this.userService.create(user);
  }

  async signIn(user: CreateUserDto): Promise<{ accessToken: string }> {
    const foundUser = await this.userRepository.findOne({
      where: { login: user.login },
    });

    if (!foundUser) {
      throw new ForbiddenException(this.messages.user);
    }

    const isMatchPassword = await bcrypt.compare(
      user.password,
      foundUser.password,
    );

    if (!isMatchPassword) {
      throw new ForbiddenException(this.messages.password);
    }

    const payload = {
      userId: foundUser.id,
      login: foundUser.login,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
