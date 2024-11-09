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
import { TrackService } from './track.service';
import { Track } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async getAll(): Promise<Track[]> {
    return await this.trackService.getAll();
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) createTrackDto: CreateTrackDto,
  ): Promise<Track> {
    return await this.trackService.create(createTrackDto);
  }

  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Track> {
    return await this.trackService.getById(id);
  }

  @Put(':id')
  async update(
    @Body(new ValidationPipe()) updateTrackDto: UpdateTrackDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return await this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return await this.trackService.delete(id);
  }
}
