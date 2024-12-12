import {
  forwardRef,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TrackService } from 'src/track/track.service';
import { FavsService } from 'src/favs/favs.service';
import { Album } from './album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    private readonly favsService: FavsService,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  private messages = {
    NOT_FOUND: 'Album is not found.',
  };

  async getAll(): Promise<Album[]> {
    return await this.albumRepository.find();
  }

  async getById(id: string): Promise<Album> {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (!album) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    return album;
  }

  async create(album: CreateAlbumDto): Promise<Album> {
    const newAlbum = {
      ...album,
      id: uuidv4(),
    };
    await this.albumRepository.save(newAlbum);

    return newAlbum;
  }

  async delete(id: string): Promise<void> {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (!album) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    await this.albumRepository.delete(id);

    await this.trackService.setAlbumIdToNull(id);

    if (await this.favsService.hasAlbum(id)) {
      await this.favsService.deleteAlbum(id);
    }
  }

  async update(id: string, data: UpdateAlbumDto): Promise<Album> {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (!album) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    const newAlbum = {
      ...album,
      ...data,
    };
    await this.albumRepository.update(id, newAlbum);

    return newAlbum;
  }

  async setArtistIdToNull(artistId: string): Promise<void> {
    const album = await this.albumRepository.findOne({
      where: { artistId },
    });

    if (!album) {
      return;
    }

    album.artistId = null;
    await this.albumRepository.save(album);
  }
}
