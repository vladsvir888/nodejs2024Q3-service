import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { FavoritesResponse } from './interfaces/favs.interface';

@Injectable()
export class FavsService {
  constructor(
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  private favs: FavoritesResponse = {
    artists: [],
    albums: [],
    tracks: [],
  };

  private messages = {
    NOT_FOUND: 'Track is not found.',
    notFoundEntity: (id: string): string => `Track with ${id} is not found.`,
  };

  async getAll(): Promise<FavoritesResponse> {
    return this.favs;
  }

  async hasTrack(id: string): Promise<boolean> {
    return this.favs.tracks.some((track) => track.id === id);
  }

  async addTrack(id: string): Promise<void> {
    const tracks = await this.trackService.getAll();
    const track = tracks.find((track) => track.id === id);

    if (!track) {
      throw new UnprocessableEntityException(this.messages.notFoundEntity(id));
    }

    this.favs.tracks.push(track);
  }

  async deleteTrack(id: string): Promise<void> {
    const track = this.favs.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    const trackIndex = this.favs.tracks.indexOf(track);
    this.favs.tracks.splice(trackIndex, 1);
  }

  async hasAlbum(id: string): Promise<boolean> {
    return this.favs.albums.some((album) => album.id === id);
  }

  async addAlbum(id: string): Promise<void> {
    const albums = await this.albumService.getAll();
    const album = albums.find((album) => album.id === id);

    if (!album) {
      throw new UnprocessableEntityException(this.messages.notFoundEntity(id));
    }

    this.favs.albums.push(album);
  }

  async deleteAlbum(id: string): Promise<void> {
    const album = this.favs.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    const albumIndex = this.favs.albums.indexOf(album);
    this.favs.albums.splice(albumIndex, 1);
  }

  async hasArtist(id: string): Promise<boolean> {
    return this.favs.artists.some((artist) => artist.id === id);
  }

  async addArtist(id: string): Promise<void> {
    const artists = await this.artistService.getAll();
    const artist = artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new UnprocessableEntityException(this.messages.notFoundEntity(id));
    }

    this.favs.artists.push(artist);
  }

  async deleteArtist(id: string): Promise<void> {
    const artist = this.favs.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    const artistIndex = this.favs.artists.indexOf(artist);
    this.favs.artists.splice(artistIndex, 1);
  }
}
