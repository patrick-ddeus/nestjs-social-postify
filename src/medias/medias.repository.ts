import { Injectable } from '@nestjs/common';
import { Media, Prisma } from '@prisma/client';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class MediaRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Prisma.MediaCreateInput): Promise<Media> {
    return this.prismaService.media.create({
      data,
    });
  }

  listAll(): Promise<Media[]> {
    return this.prismaService.media.findMany({});
  }

  listOne(where: Prisma.MediaWhereInput): Promise<Media> {
    return this.prismaService.media.findFirst({
      where,
    });
  }

  update(where: Prisma.MediaWhereUniqueInput, data: Prisma.MediaUpdateInput) {
    return this.prismaService.media.update({
      where,
      data,
    });
  }

  delete(where: Prisma.MediaWhereUniqueInput) {
    return this.prismaService.media.delete({
      where,
    });
  }
}
