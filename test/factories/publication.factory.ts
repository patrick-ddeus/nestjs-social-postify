import { PrismaService } from '@/database';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PublicationFactory {
  constructor(private readonly prisma: PrismaService) {}

  async create(mediaId: number, postId: number, isPast: boolean, date?: Date) {
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
        date: date ? date : isPast ? faker.date.past() : faker.date.future(),
      },
    });
    await this.prisma.$disconnect();
    return response;
  }
}
