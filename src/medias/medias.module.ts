import { Module } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { PrismaModule } from '@/database/prisma.module';
import { MediaRepository } from './medias.repository';

@Module({
  imports: [PrismaModule],
  controllers: [MediasController],
  providers: [MediasService, MediaRepository],
})
export class MediasModule {}
