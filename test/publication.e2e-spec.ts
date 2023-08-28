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

  describe('/publications (GET)', () => {
    it('should return all publications with status code 200', async () => {
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
        true,
      );

      const { body, status } = await server.get('/publications');

      expect(status).toBe(200);
      expect(body).toEqual(
        expect.arrayContaining([
          {
            id: publication.id,
            mediaId: media.id,
            postId: post.id,
            date: publication.date.toISOString(),
            createdAt: publication.createdAt.toISOString(),
            updatedAt: publication.updatedAt.toISOString(),
          },
        ]),
      );
    });

    it('should return publications already published with status code 200 when published is true', async () => {
      const media = await mediaFactory.create(
        'Instagram',
        'https://www.instagram.com/USERNAME',
      );

      const post = await postFactory.create(
        'Why you should have a guinea pig?',
        'https://www.guineapigs.com/why-you-should-guinea',
      );

      for (let i = 0; i < 5; i++) {
        const isPast = i % 2 === 0;
        await publicationFactory.create(media.id, post.id, isPast);
      }

      const { status, body } = await server.get('/publications?published=true');

      expect(status).toBe(200);
      expect(body).toHaveLength(3);
    });

    it('should return publications are not published yet with status code 200 when published is false', async () => {
      const media = await mediaFactory.create(
        'Instagram',
        'https://www.instagram.com/USERNAME',
      );

      const post = await postFactory.create(
        'Why you should have a guinea pig?',
        'https://www.guineapigs.com/why-you-should-guinea',
      );

      for (let i = 0; i < 5; i++) {
        const isPast = i % 2 === 0;
        await publicationFactory.create(media.id, post.id, isPast);
      }

      const { status, body } = await server.get(
        '/publications?published=false',
      );

      expect(status).toBe(200);
      expect(body).toHaveLength(2);
    });

    it('should return publications after provided date with status code 200 when after is a valid date', async () => {
      const media = await mediaFactory.create(
        'Instagram',
        'https://www.instagram.com/USERNAME',
      );

      const post = await postFactory.create(
        'Why you should have a guinea pig?',
        'https://www.guineapigs.com/why-you-should-guinea',
      );

      await publicationFactory.create(
        media.id,
        post.id,
        false,
        new Date('2023-9-02'),
      );

      await publicationFactory.create(
        media.id,
        post.id,
        false,
        new Date('2023-4-02'),
      );

      await publicationFactory.create(
        media.id,
        post.id,
        false,
        new Date('2023-12-02'),
      );

      const { status, body } = await server.get(
        '/publications?after=2023-6-02',
      );

      expect(status).toBe(200);
      expect(body).toHaveLength(2);
    });

    it('should return publications published after provided date with status 200 when after is a valid date and published is true', async () => {
      const media = await mediaFactory.create(
        'Instagram',
        'https://www.instagram.com/USERNAME',
      );

      const post = await postFactory.create(
        'Why you should have a guinea pig?',
        'https://www.guineapigs.com/why-you-should-guinea',
      );

      await publicationFactory.create(
        media.id,
        post.id,
        false,
        new Date('2023-8-02'),
      );

      await publicationFactory.create(
        media.id,
        post.id,
        false,
        new Date('2023-4-02'),
      );

      await publicationFactory.create(
        media.id,
        post.id,
        false,
        new Date('2023-12-02'),
      );

      await publicationFactory.create(
        media.id,
        post.id,
        false,
        new Date('2023-12-02'),
      );

      const { status, body } = await server.get(
        '/publications?after=2023-6-02&published=true',
      );

      expect(status).toBe(200);
      expect(body).toHaveLength(1);
    });
  });
});
