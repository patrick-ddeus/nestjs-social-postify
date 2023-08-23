import { Post as PrismaPost } from '@prisma/client';

export class Post implements PrismaPost {
  id: number;
  title: string;
  text: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}
