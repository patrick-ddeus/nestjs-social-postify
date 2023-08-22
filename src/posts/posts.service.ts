import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { Post } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(createPostDto: CreatePostDto) {
    return this.postRepository.createPost(createPostDto);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.listPosts();
  }

  findOne(id: number) {
    return this.postRepository.listOnePost({ id });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.updateOne({ id }, updatePostDto);

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
