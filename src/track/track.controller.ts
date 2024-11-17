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
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';
import { Track } from './track.entity';

@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @ApiOperation({
    summary: 'Get all tracks',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
  })
  @Get()
  async getAll(): Promise<Track[]> {
    return await this.trackService.getAll();
  }

  @ApiOperation({
    summary: 'Add new track',
  })
  @ApiBody({
    type: CreateTrackDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Track is created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Body does not contain required fields',
  })
  @Post()
  async create(
    @Body(new ValidationPipe()) createTrackDto: CreateTrackDto,
  ): Promise<Track> {
    return await this.trackService.create(createTrackDto);
  }

  @ApiOperation({
    summary: 'Get single track by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Track was not found' })
  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Track> {
    return await this.trackService.getById(id);
  }

  @ApiOperation({
    summary: 'Update track information',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'The track has been updated' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Track was not found' })
  @Put(':id')
  async update(
    @Body(new ValidationPipe()) updateTrackDto: UpdateTrackDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return await this.trackService.update(id, updateTrackDto);
  }

  @ApiOperation({
    summary: 'Delete track',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({ status: 204, description: 'Deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Track was not found' })
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return await this.trackService.delete(id);
  }
}
