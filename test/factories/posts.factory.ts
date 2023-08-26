import { PrismaService } from '@/database';
import { faker } from '@faker-js/faker';

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

  static build() {
    return {
      id: 1,
      title: faker.lorem.sentence(5),
      text: faker.lorem.sentence(5),
      image: faker.internet.url({ protocol: 'http' }),
      createdAt: faker.date.anytime(),
      updatedAt: faker.date.anytime(),
    };
  }
}
