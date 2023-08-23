import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PostsModule } from '@/posts/posts.module';
import { Helpers } from './helpers';
import { PostFactory } from './factories/posts.factory';

const helper = new Helpers();
const postFactory = new PostFactory();

describe('PostsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PostsModule],
    }).compile();

    helper.cleanDb();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/posts (GET) should return all posts with status code 200', async () => {
    const post = await postFactory.create(
      'Why you should have a guinea pig?',
      'https://www.guineapigs.com/why-you-should-guinea',
    );

    return request(app.getHttpServer())
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
