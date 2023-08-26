import { PrismaService } from '@/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PublicationFactory {
  constructor(private readonly prisma: PrismaService) {}

  async create(mediaId: number, postId: number, date: Date) {
    const response = await this.prisma.publication.create({
      data: {
        media: {
          connect: {
            id: mediaId,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
        date,
      },
    });
    await this.prisma.$disconnect();
    return response;
  }
}
