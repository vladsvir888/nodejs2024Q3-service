import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { ApiTags, ApiResponse, ApiParam, ApiOperation } from '@nestjs/swagger';

@ApiTags('Favs')
@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @ApiOperation({
    summary: 'Get all favorites',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
  })
  @Get()
  async getAll() {
    return await this.favsService.getAll();
  }

  @ApiOperation({
    summary: 'Add track to the favorites',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({ status: 201, description: 'Added successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiResponse({ status: 422, description: "Track with id doesn't exist." })
  @Post('/track/:id')
  async createTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.addTrack(id);
  }

  @ApiOperation({
    summary: 'Delete track from the favorites',
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
  @ApiResponse({ status: 404, description: 'Track was not found.' })
  @Delete('/track/:id')
  @HttpCode(204)
  async deleteTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.deleteTrack(id);
  }

  @ApiOperation({
    summary: 'Add album to the favorites',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({ status: 201, description: 'Added successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiResponse({ status: 422, description: "Album with id doesn't exist." })
  @Post('/album/:id')
  async createAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.addAlbum(id);
  }

  @ApiOperation({
    summary: 'Delete album from the favorites',
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
  @ApiResponse({ status: 404, description: 'Album was not found.' })
  @Delete('/album/:id')
  @HttpCode(204)
  async deleteAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.deleteAlbum(id);
  }

  @ApiOperation({
    summary: 'Add artist to the favorites',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({ status: 201, description: 'Added successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiResponse({ status: 422, description: "Artist with id doesn't exist." })
  @Post('/artist/:id')
  async createArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.addArtist(id);
  }

  @ApiOperation({
    summary: 'Delete artist from the favorites',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({ status: 204, description: 'Deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Artist was not found.' })
  @Delete('/artist/:id')
  @HttpCode(204)
  async deleteArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.deleteArtist(id);
  }
}
