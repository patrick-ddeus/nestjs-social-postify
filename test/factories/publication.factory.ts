import { PrismaService } from '@/database';

export class PublicationFactory {
  private readonly prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  async create(mediaId: number, postId: number, date: Date) {
    return await this.prisma.publication.create({
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
  }
}
