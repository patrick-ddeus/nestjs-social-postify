import { Injectable } from '@nestjs/common';
import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './posts.repository';
import { Post } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(createPostDto: CreatePostDto) {
    return this.postRepository.create(createPostDto);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.listAll();
  }

  async findOne(id: number) {
    const post = await this.postRepository.listOne({ id });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.postRepository.update({ id }, updatePostDto);
      return post;
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException();
    }
  }

  async remove(id: number) {
    try {
      const deletedMedia = await this.postRepository.delete({ id });
      return deletedMedia;
    } catch (error) {
      if (error.code === 'P2003')
        throw new ForbiddenException(
          'You must remove the publication before media',
        );
      if (error.code === 'P2025') throw new NotFoundException();
    }
  }
}
