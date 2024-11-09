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

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  async getAll() {
    return await this.favsService.getAll();
  }

  @Post('/track/:id')
  async createTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.addTrack(id);
  }

  @Delete('/track/:id')
  @HttpCode(204)
  async deleteTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.deleteTrack(id);
  }

  @Post('/album/:id')
  async createAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.addAlbum(id);
  }

  @Delete('/album/:id')
  @HttpCode(204)
  async deleteAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.deleteAlbum(id);
  }

  @Post('/artist/:id')
  async createArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.addArtist(id);
  }

  @Delete('/artist/:id')
  @HttpCode(204)
  async deleteArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.favsService.deleteArtist(id);
  }
}
