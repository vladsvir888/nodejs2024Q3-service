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
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';
import { Album } from './album.entity';

@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @ApiOperation({
    summary: 'Get albums list',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
  })
  @Get()
  async getAll(): Promise<Album[]> {
    return await this.albumService.getAll();
  }

  @ApiOperation({
    summary: 'Add new album',
  })
  @ApiBody({
    type: CreateAlbumDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Album is created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Body does not contain required fields',
  })
  @Post()
  async create(
    @Body(new ValidationPipe()) createAlbumDto: CreateAlbumDto,
  ): Promise<Album> {
    return await this.albumService.create(createAlbumDto);
  }

  @ApiOperation({
    summary: 'Get single album by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Album was not found' })
  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Album> {
    return await this.albumService.getById(id);
  }

  @ApiOperation({
    summary: 'Update album information',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'The album has been updated' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Album was not found' })
  @Put(':id')
  async update(
    @Body(new ValidationPipe()) updateAlbumDto: UpdateAlbumDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return await this.albumService.update(id, updateAlbumDto);
  }

  @ApiOperation({
    summary: 'Delete album',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({ status: 204, description: 'Deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Album was not found' })
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return await this.albumService.delete(id);
  }
}
