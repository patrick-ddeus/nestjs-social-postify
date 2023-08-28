import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PostsModule } from '@/posts/posts.module';
import { Helpers } from './helpers';
import { PostFactory } from './factories/posts.factory';
import { PrismaModule } from '../src/database';
import { MediaFactory, PublicationFactory } from './factories';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let server: request.SuperTest<request.Test>;
  let mediaFactory: MediaFactory;
  let publicationFactory: PublicationFactory;
  let postFactory: PostFactory;
  let helper: Helpers;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PostsModule, PrismaModule],
      providers: [MediaFactory, PublicationFactory, PostFactory, Helpers],
    }).compile();

    mediaFactory = moduleFixture.get<MediaFactory>(MediaFactory);
    publicationFactory =
      moduleFixture.get<PublicationFactory>(PublicationFactory);
    postFactory = moduleFixture.get<PostFactory>(PostFactory);
    helper = moduleFixture.get<Helpers>(Helpers);

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = request(app.getHttpServer());
  });

  beforeEach(async () => {
    await helper.cleanDb();
  });

  describe('/posts (POST)', () => {
    it('should return 400 when body is invalid', async () => {
      const { status } = await server.post(`/posts`).send({ name: '12345' });

      expect(status).toBe(400);
    });

    it('should return 201 when media is created', async () => {
      const { status } = await server
        .post(`/posts`)
        .send({ title: 'instagram', text: 'texto teste' });

      expect(status).toBe(201);
    });
  });

  describe('/posts (GET)', () => {
    it('should return all posts with status code 200', async () => {
      const post = await postFactory.create(
        'Why you should have a guinea pig?',
        'https://www.guineapigs.com/why-you-should-guinea',
      );

      return server
        .get('/posts')
        .expect(200)
        .expect([
          {
            id: post.id,
            title: post.title,
            text: post.text,
            image: null,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
          },
        ]);
    });
  });

  describe('/posts/:id (GET)', () => {
    it('should return 404 when theres no post with provided id', async () => {
      const { status } = await server.get('/posts/999999');

      expect(status).toBe(404);
    });

    it('should return 200 with the post with provided id', async () => {
      const post = await postFactory.create(
        'Why you should have a guinea pig?',
        'https://www.guineapigs.com/why-you-should-guinea',
      );

      const { status, body } = await server.get(`/posts/${post.id}`);

      expect(status).toBe(200);
      expect(body).toEqual({
        id: post.id,
        image: post.image,
        text: post.text,
        title: post.title,
        updatedAt: post.updatedAt.toISOString(),
        createdAt: post.createdAt.toISOString(),
      });
    });
  });

  describe('/posts/:id (PATCH)', () => {
    it('should return 404 when theres no post with provided id', async () => {
      const { status } = await server.patch('/posts/999999');

      expect(status).toBe(404);
    });

    it('should return 200 with the post with provided id', async () => {
      const post = await postFactory.create(
        'Why you should have a guinea pig?',
        'https://www.guineapigs.com/why-you-should-guinea',
      );

      const { status, body } = await server
        .patch(`/posts/${post.id}`)
        .send({ text: 'novo texto atualizado' });

      expect(status).toBe(200);
      expect(body).toEqual(
        expect.objectContaining({
          text: 'novo texto atualizado',
        }),
      );
    });
  });

  describe('/posts/:id (DELETE)', () => {
    it('should return 404 when theres no media with provided id', async () => {
      await postFactory.create(
        'Instagram',
        'https://www.instagram.com/USERNAME',
      );
      const { status } = await server.delete(`/posts/9999`);

      expect(status).toBe(404);
    });

    it('should return 403 when theres a media registered in publication table', async () => {
      const media = await mediaFactory.create(
        'Instagram',
        'https://www.instagram.com/USERNAME',
      );

      const post = await postFactory.create(
        'Why you should have a guinea pig?',
        'https://www.guineapigs.com/why-you-should-guinea',
      );

      await publicationFactory.create(media.id, post.id, false);

      const { status } = await server.delete(`/posts/${post.id}`);

      expect(status).toBe(403);
    });
  });
});
