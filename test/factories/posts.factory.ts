import { PrismaService } from '@/database';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostFactory {
  constructor(private readonly prisma: PrismaService) {}

  async create(title: string, text: string) {
    const response = await this.prisma.post.create({
      data: { title, text },
    });
    await this.prisma.$disconnect();

    return response;
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
