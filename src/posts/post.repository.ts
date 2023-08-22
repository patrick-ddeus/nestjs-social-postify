import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Post, Prisma } from '@prisma/client';

@Injectable()
export class PostRepository {
  constructor(private prisma: PrismaService) {}

  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  async listPosts(): Promise<Post[]> {
    return this.prisma.post.findMany({});
  }

  async listOnePost(where: Prisma.PostWhereInput): Promise<Post> {
    return this.prisma.post.findFirst({
      where,
    });
  }

  async updateOne(
    where: Prisma.PostWhereUniqueInput,
    data: Prisma.PostUpdateInput,
  ) {
    return this.prisma.post.update({
      where,
      data,
    });
  }
}
