import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Track } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FavsService } from 'src/favs/favs.service';

@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
  ) {}

  private tracks: Track[] = [];

  private messages = {
    NOT_FOUND: 'Track is not found.',
  };

  async getAll(): Promise<Track[]> {
    return this.tracks;
  }

  async getById(id: string): Promise<Track> {
    const track = this.tracks.find((track) => track.id === id);

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
    this.tracks.push(newTrack);

    return newTrack;
  }

  async delete(id: string): Promise<void> {
    const track = this.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    this.tracks = this.tracks.filter((track) => track.id !== id);

    if (await this.favsService.hasTrack(id)) {
      await this.favsService.deleteTrack(id);
    }
  }

  async update(id: string, data: UpdateTrackDto): Promise<Track> {
    const track = this.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    const trackIndex = this.tracks.indexOf(track);
    const newTrack = {
      ...track,
      ...data,
    };
    this.tracks.splice(trackIndex, 1, newTrack);

    return newTrack;
  }

  async setArtistIdToNull(id: string): Promise<void> {
    const track = this.tracks.find((track) => track.artistId === id);

    if (!track) {
      return;
    }

    track.artistId = null;
  }

  async setAlbumIdToNull(id: string): Promise<void> {
    const track = this.tracks.find((track) => track.albumId === id);

    if (!track) {
      return;
    }

    track.albumId = null;
  }
}
