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
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';
import { Artist } from './artist.entity';

@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @ApiOperation({
    summary: 'Get all artists',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
  })
  @Get()
  async getAll(): Promise<Artist[]> {
    return await this.artistService.getAll();
  }

  @ApiOperation({
    summary: 'Add new artist',
  })
  @ApiBody({
    type: CreateArtistDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Artist is created',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Body does not contain required fields',
  })
  @Post()
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateArtistDto,
  ): Promise<Artist> {
    return await this.artistService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Get single artist by id',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Successful operation' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Artist was not found' })
  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Artist> {
    return await this.artistService.getById(id);
  }

  @ApiOperation({
    summary: 'Update artist information',
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'The artist has been updated' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Artist was not found' })
  @Put(':id')
  async update(
    @Body(new ValidationPipe()) updateArtistDto: UpdateArtistDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return await this.artistService.update(id, updateArtistDto);
  }

  @ApiOperation({
    summary: 'Delete artist',
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
  @ApiResponse({ status: 404, description: 'Artist was not found' })
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return await this.artistService.delete(id);
  }
}
