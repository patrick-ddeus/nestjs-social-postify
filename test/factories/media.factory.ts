import { PrismaService } from '@/database';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaFactory {
  constructor(private readonly prisma: PrismaService) {}

  async create(title: string, username: string) {
    const response = await this.prisma.media.create({
      data: { title, username },
    });
    await this.prisma.$disconnect();
    return response;
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
