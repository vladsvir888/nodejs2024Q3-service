import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserWithoutPassword } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Tokens } from 'src/token/types';
import { RefreshTokenDto } from 'src/token/dto/refresh-token.dto';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  private messages = {
    user: 'User is not found.',
    password: 'Passwords do not match.',
    noRefreshTokenInBody: 'No refresh token in body',
    invalidRefreshToken: 'Refresh token is invalid or expired',
  };

  async signUp(user: CreateUserDto): Promise<UserWithoutPassword> {
    return await this.userService.create(user);
  }

  async signIn(user: CreateUserDto): Promise<Tokens> {
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
    const tokens = await this.tokenService.getTokens(payload);
    await this.tokenService.saveTokens({ ...payload, ...tokens });

    return tokens;
  }

  async refresh(token: RefreshTokenDto): Promise<Tokens> {
    if (!token) {
      throw new UnauthorizedException(this.messages.noRefreshTokenInBody);
    }

    const userToken = await this.tokenService.findUserByToken(token);

    if (!userToken) {
      throw new ForbiddenException(this.messages.invalidRefreshToken);
    }

    await this.tokenService.deleteToken(token);

    const payload = {
      userId: userToken.userId,
      login: userToken.login,
    };
    const tokens = await this.tokenService.getTokens(payload);
    await this.tokenService.saveTokens({ ...payload, ...tokens });

    return tokens;
  }
}
