import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Artist } from './interfaces/artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getAll(): Promise<Artist[]> {
    return await this.artistService.getAll();
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateArtistDto,
  ): Promise<Artist> {
    return await this.artistService.create(createUserDto);
  }

  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Artist> {
    return await this.artistService.getById(id);
  }

  @Put(':id')
  async update(
    @Body(new ValidationPipe()) updateArtistDto: UpdateArtistDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return await this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return await this.artistService.delete(id);
  }
}
