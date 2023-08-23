import { PrismaService } from '@/database';

export class MediaFactory {
  private readonly prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  create(title: string, username: string) {
    return this.prisma.media.create({
      data: { title, username },
    });
  }
}
