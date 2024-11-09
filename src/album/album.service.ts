import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Album } from './interfaces/album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService {
  constructor(private readonly trackService: TrackService) {}

  private albums: Album[] = [];

  private messages = {
    NOT_FOUND: 'Album is not found.',
  };

  async getAll(): Promise<Album[]> {
    return this.albums;
  }

  async getById(id: string): Promise<Album> {
    const album = this.albums.find((album) => album.id === id);

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
    this.albums.push(newAlbum);

    return newAlbum;
  }

  async delete(id: string): Promise<void> {
    const album = this.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    this.albums = this.albums.filter((album) => album.id !== id);

    await this.trackService.setAlbumIdToNull(id);
  }

  async update(id: string, data: UpdateAlbumDto): Promise<Album> {
    const album = this.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    const albumIndex = this.albums.indexOf(album);
    const newAlbum = {
      ...album,
      ...data,
    };
    this.albums.splice(albumIndex, 1, newAlbum);

    return newAlbum;
  }

  async setArtistIdToNull(id: string): Promise<void> {
    const album = this.albums.find((album) => album.artistId === id);

    if (!album) {
      return;
    }

    album.artistId = null;
  }
}
