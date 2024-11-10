import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  @ApiProperty({
    example: 'Eminem',
    required: false,
  })
  name: string;

  @ApiProperty({
    example: true,
    required: false,
  })
  grammy: boolean;
}
