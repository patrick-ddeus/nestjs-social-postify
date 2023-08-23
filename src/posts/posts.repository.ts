import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Post, Prisma } from '@prisma/client';

@Injectable()
export class PostRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  async listAll(): Promise<Post[]> {
    return this.prisma.post.findMany({});
  }

  async listOne(where: Prisma.PostWhereInput): Promise<Post> {
    return this.prisma.post.findFirst({
      where,
    });
  }

  async update(
    where: Prisma.PostWhereUniqueInput,
    data: Prisma.PostUpdateInput,
  ) {
    return this.prisma.post.update({
      where,
      data,
    });
  }

  delete(where: Prisma.PostWhereUniqueInput) {
    return this.prisma.post.delete({
      where,
    });
  }
}
