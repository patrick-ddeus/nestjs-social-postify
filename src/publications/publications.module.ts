import { Module } from '@nestjs/common';
import { PrismaModule } from '@/database';
import {
  PublicationsController,
  PublicationsService,
  PublicationsRepository,
} from './';

@Module({
  imports: [PrismaModule],
  controllers: [PublicationsController],
  providers: [PublicationsService, PublicationsRepository],
})
export class PublicationsModule {}
