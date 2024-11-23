import {
  Body,
  Controller,
  HttpCode,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UserWithoutPassword } from 'src/user/user.entity';
import { Public } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Signup a user',
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Successful signup',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @Public()
  @Post('/signup')
  async signUp(
    @Body(new ValidationPipe()) signUpDto: CreateUserDto,
  ): Promise<UserWithoutPassword> {
    return await this.authService.signUp(signUpDto);
  }

  @ApiOperation({
    summary: 'Logins a user and returns a JWT-token',
  })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Successful login.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 403,
    description: 'Incorrect login or password',
  })
  @HttpCode(200)
  @Public()
  @Post('/login')
  async signIn(
    @Body(new ValidationPipe()) signInDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(signInDto);
  }
}
