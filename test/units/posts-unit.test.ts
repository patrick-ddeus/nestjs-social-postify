import { PrismaService } from '@/database';
import { PostFactory } from '../factories';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PostsService } from '@/posts/posts.service';
import { PostRepository } from '@/posts/posts.repository';

describe('Post unit tests', () => {
  let service: PostsService;
  let repository: PostRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PostRepository, PostsService, PrismaService],
    }).compile();

    repository = moduleRef.get<PostRepository>(PostRepository);
    service = moduleRef.get<PostsService>(PostsService);
  });

  describe('service findAll', () => {
    it('Should return all posts', async () => {
      const posts = PostFactory.build();

      jest.spyOn(repository, 'listAll').mockResolvedValue([posts]);

      const response = await service.findAll();
      expect(response).toEqual(expect.arrayContaining([posts]));
    });
  });

  describe('service findOne', () => {
    it('Should return notFoundException when theres no post with provided id', async () => {
      jest.spyOn(repository, 'listOne').mockResolvedValueOnce(null);

      const response = service.findOne(9999);
      expect(response).rejects.toThrow(new NotFoundException());
    });

    it('Should return post with the provided id', async () => {
      const post = PostFactory.build();

      jest.spyOn(repository, 'listOne').mockResolvedValueOnce(post);

      const response = service.findOne(1);
      expect(response).resolves.toEqual(post);
    });
  });

  describe('service update', () => {
    it('should return NotFound when theres no post with provided id', async () => {
      jest.spyOn(repository, 'update').mockRejectedValueOnce({ code: 'P2025' });

      const response = service.update(1, PostFactory.build());
      expect(response).rejects.toThrow(new NotFoundException());
    });

    it('Should return media with the provided id', async () => {
      const newPost = PostFactory.build();
      jest.spyOn(repository, 'listOne').mockResolvedValueOnce(null);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(newPost);

      const response = service.update(1, newPost);
      expect(response).resolves.toEqual(newPost);
    });
  });

  describe('service delete', () => {
    it('Should return media deleted', async () => {
      const newPost = PostFactory.build();
      jest.spyOn(repository, 'delete').mockResolvedValueOnce(newPost);

      const response = service.remove(1);
      expect(response).resolves.toEqual(newPost);
    });
  });
});
