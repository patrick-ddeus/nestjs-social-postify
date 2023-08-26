import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Helpers } from './helpers';
import { PublicationFactory, MediaFactory, PostFactory } from './factories';
import { PublicationsModule } from '../src/publications/publications.module';
import { PrismaModule } from '../src/database';

describe('PublicationsController (e2e)', () => {
  let app: INestApplication;
  let server: request.SuperTest<request.Test>;
  let mediaFactory: MediaFactory;
  let publicationFactory: PublicationFactory;
  let postFactory: PostFactory;
  let helper: Helpers;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PublicationsModule, PrismaModule],
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

  it('/publications/?published (GET) should return publications with status code 200 and published true', async () => {
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
      new Date('2022-11-05'),
    );

    const { status, body } = await server.get('/publications?published=true');

    expect(status).toBe(200);
    expect(body).toEqual(
      expect.arrayContaining([
        {
          id: publication.id,
          date: publication.date.toISOString(),
          mediaId: publication.mediaId,
          postId: publication.postId,
          updatedAt: publication.updatedAt.toISOString(),
          createdAt: publication.createdAt.toISOString(),
        },
      ]),
    );
  });
});
