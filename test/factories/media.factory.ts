import { PrismaService } from '@/database';
import { faker } from '@faker-js/faker';

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

  static build() {
    return {
      id: 1,
      title: faker.company.name(),
      username: faker.internet.url(),
      createdAt: faker.date.anytime(),
      updatedAt: faker.date.anytime(),
    };
  }
}
