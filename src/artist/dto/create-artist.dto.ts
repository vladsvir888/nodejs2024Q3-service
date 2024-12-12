import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty({
    example: 'Adele',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: true,
    required: true,
  })
  @IsBoolean()
  grammy: boolean;
}
