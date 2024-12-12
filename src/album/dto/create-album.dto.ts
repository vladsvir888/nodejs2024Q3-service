import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({
    example: 'Recovery',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 2010,
    required: true,
  })
  @IsInt()
  year: number;

  @ApiProperty({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  artistId: string;
}
