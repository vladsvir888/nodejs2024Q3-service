import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './interfaces/artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  private messages = {
    NOT_FOUND: 'Artist is not found.',
  };

  async getAll(): Promise<Artist[]> {
    return this.artists;
  }

  async getById(id: string): Promise<Artist> {
    const artist = this.artists.find((artist) => artist.id === id);

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
    this.artists.push(newArtist);

    return newArtist;
  }

  async delete(id: string): Promise<void> {
    const artist = this.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    this.artists = this.artists.filter((artist) => artist.id !== id);
  }

  async update(id: string, data: UpdateArtistDto): Promise<Artist> {
    const artist = this.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException(this.messages.NOT_FOUND);
    }

    const artistIndex = this.artists.indexOf(artist);
    const newArtist = {
      ...artist,
      ...data,
    };
    this.artists.splice(artistIndex, 1, newArtist);

    return newArtist;
  }
}
