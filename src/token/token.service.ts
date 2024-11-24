import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { Repository } from 'typeorm';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
  ) {}

  async findUserByToken({ refreshToken }: RefreshTokenDto): Promise<Token> {
    return await this.tokenRepository.findOne({
      where: { refreshToken },
    });
  }

  async deleteToken({ refreshToken }: RefreshTokenDto): Promise<void> {
    const userToken = await this.findUserByToken({ refreshToken });

    if (!userToken) {
      return;
    }

    await this.tokenRepository.delete(userToken.userId);
  }

  async saveTokens(tokenData: Token): Promise<void> {
    await this.tokenRepository.save(tokenData);
  }

  async getTokens(payload: Record<string, unknown>): Promise<Tokens> {
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.TOKEN_EXPIRES_IN,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_REFRESH,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRES_IN,
      }),
    };
  }
}
