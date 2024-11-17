import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { FavsService } from 'src/favs/favs.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';

@Injectable()
export class ArtistService {
  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  private messages = {
    NOT_FOUND: 'Artist is not found.',
  };

  async getAll(): Promise<Artist[]> {
    return await this.artistRepository.find();
  }

  async getById(id: string): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id } });

    if (!artist) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    return artist;
  }

  async create(artist: CreateArtistDto): Promise<Artist> {
    const newArtist = {
      ...artist,
      id: uuidv4(),
    };
    await this.artistRepository.save(newArtist);

    return newArtist;
  }

  async delete(id: string): Promise<void> {
    const artist = await this.artistRepository.findOne({ where: { id } });

    if (!artist) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    await this.artistRepository.delete(id);

    await this.albumService.setArtistIdToNull(id);
    await this.trackService.setArtistIdToNull(id);

    if (await this.favsService.hasArtist(id)) {
      await this.favsService.deleteArtist(id);
    }
  }

  async update(id: string, data: UpdateArtistDto): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id } });

    if (!artist) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    const newArtist = {
      ...artist,
      ...data,
    };
    await this.artistRepository.update(id, newArtist);

    return newArtist;
  }
}
