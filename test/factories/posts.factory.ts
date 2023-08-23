import { PrismaService } from '@/database';

export class PostFactory {
  private readonly prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  async create(title: string, text: string) {
    return await this.prisma.post.create({
      data: { title, text },
    });
  }
}
