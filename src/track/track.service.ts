import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FavsService } from 'src/favs/favs.service';
import { Track } from './track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  private messages = {
    NOT_FOUND: 'Track is not found.',
  };

  async getAll(): Promise<Track[]> {
    return await this.trackRepository.find();
  }

  async getById(id: string): Promise<Track> {
    const track = await this.trackRepository.findOne({ where: { id } });

    if (!track) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    return track;
  }

  async create(track: CreateTrackDto): Promise<Track> {
    const newTrack = {
      ...track,
      id: uuidv4(),
    };
    await this.trackRepository.save(newTrack);

    return newTrack;
  }

  async delete(id: string): Promise<void> {
    const track = await this.trackRepository.findOne({ where: { id } });

    if (!track) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    await this.trackRepository.delete(id);

    if (await this.favsService.hasTrack(id)) {
      await this.favsService.deleteTrack(id);
    }
  }

  async update(id: string, data: UpdateTrackDto): Promise<Track> {
    const track = await this.trackRepository.findOne({ where: { id } });

    if (!track) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    const newTrack = {
      ...track,
      ...data,
    };
    await this.trackRepository.update(id, newTrack);

    return newTrack;
  }

  async setArtistIdToNull(artistId: string): Promise<void> {
    const track = await this.trackRepository.findOne({ where: { artistId } });

    if (!track) {
      return;
    }

    track.artistId = null;
    await this.trackRepository.save(track);
  }

  async setAlbumIdToNull(albumId: string): Promise<void> {
    const track = await this.trackRepository.findOne({ where: { albumId } });

    if (!track) {
      return;
    }

    track.albumId = null;
    await this.trackRepository.save(track);
  }
}
