import { Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { AlbumModule } from 'src/album/album.module';
import { ArtistModule } from 'src/artist/artist.module';
import { TrackModule } from 'src/track/track.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AlbumModule, ArtistModule, TrackModule, UserModule],
  controllers: [FavsController],
  providers: [FavsService],
  exports: [FavsService],
})
export class FavsModule {}
