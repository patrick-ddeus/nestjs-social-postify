import { PrismaService } from '@/database';

export class MediaFactory {
  private readonly prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  async create(title: string, username: string) {
    return await this.prisma.media.create({
      data: { title, username },
    });
  }
}
