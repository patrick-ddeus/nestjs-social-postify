import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PostsModule } from '@/posts/posts.module';
import { Helpers } from './helpers';
import { PostFactory } from './factories/posts.factory';
import { PrismaModule } from '../src/database';

const helper = new Helpers();
const postFactory = new PostFactory();

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let server: request.SuperTest<request.Test>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PostsModule, PrismaModule],
    }).compile();

    await helper.cleanDb();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = request(app.getHttpServer());
  });

  it('/posts (GET) should return all posts with status code 200', async () => {
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
