import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Helpers } from './helpers';
import { PublicationFactory, MediaFactory, PostFactory } from './factories';
import { PublicationsModule } from '../src/publications/publications.module';

const helper = new Helpers();

const mediaFactory = new MediaFactory();
const publicationFactory = new PublicationFactory();
const postFactory = new PostFactory();

describe('PublicationsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PublicationsModule],
    }).compile();

    helper.cleanDb();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/publications (GET) should return all publications with status code 200', async () => {
    const media = await mediaFactory.create(
      'Instagram',
      'https://www.instagram.com/USERNAME',
    );

    const post = await postFactory.create(
      'Why you should have a guinea pig?',
      'https://www.guineapigs.com/why-you-should-guinea',
    );

    const publication = await publicationFactory.create(
      media.id,
      post.id,
      new Date(),
    );

    return request(app.getHttpServer())
      .get('/publications')
      .expect(200)
      .expect([
        {
          id: publication.id,
          mediaId: media.id,
          postId: post.id,
          date: publication.date.toISOString(),
          createdAt: publication.createdAt.toISOString(),
          updatedAt: publication.updatedAt.toISOString(),
        },
      ]);
  });
});
