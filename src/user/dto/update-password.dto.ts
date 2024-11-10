import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'qwerty',
    required: true,
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    example: 'ytrewq',
    required: true,
  })
  @IsString()
  newPassword: string;
}
