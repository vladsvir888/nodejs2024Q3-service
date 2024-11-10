import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'login123',
    required: true,
  })
  @IsString()
  login: string;

  @ApiProperty({
    example: 'qwerty',
    required: true,
  })
  @IsString()
  password: string;
}
