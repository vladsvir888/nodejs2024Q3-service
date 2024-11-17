import { Artist } from 'src/artist/artist.entity';
import { Album } from 'src/album/album.entity';
import { Track } from 'src/track/track.entity';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
