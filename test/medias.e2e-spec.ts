import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MediasModule } from '@/medias/medias.module';
import { Helpers } from './helpers';
import { MediaFactory } from './factories/media.factory';
import { PostFactory, PublicationFactory } from './factories';

describe('MediasController (e2e)', () => {
  let app: INestApplication;
  let server: request.SuperTest<request.Test>;
  let mediaFactory: MediaFactory;
  let publicationFactory: PublicationFactory;
  let postFactory: PostFactory;
  let helper: Helpers;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MediasModule],
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

  describe('/medias (POST)', () => {
    it('should return 409 when there is already a username and title registered', async () => {
      const media = await mediaFactory.create(
        'Instagram',
        'https://www.instagram.com/USERNAME',
      );
      const { status } = await server.post(`/medias`).send(media);

      expect(status).toBe(409);
    });

    it('should return 201 when media is created', async () => {
      const media = MediaFactory.build();

      const { status } = await server.post(`/medias`).send(media);

      expect(status).toBe(201);
    });
  });

  it('/medias (GET) should return all medias with status code 200', async () => {
    const media = await mediaFactory.create(
      'Instagram',
      'https://www.instagram.com/USERNAME',
    );

    const { body, status } = await server.get('/medias');

    expect(status).toBe(200);
    expect(body).toEqual(
      expect.arrayContaining([
        {
          id: media.id,
          title: media.title,
          username: media.username,
          createdAt: media.createdAt.toISOString(),
          updatedAt: media.updatedAt.toISOString(),
        },
      ]),
    );
  });

  describe('/medias/:id (GET)', () => {
    it('should return status 400 when theres no media with provided id', async () => {
      const { status } = await server.get(`/medias/99999`);

      expect(status).toBe(404);
    });

    it('should return media by id with status 200', async () => {
      const media = await mediaFactory.create(
        'Instagram',
        'https://www.instagram.com/USERNAME',
      );

      const { body, status } = await server.get(`/medias/${media.id}`);

      expect(status).toBe(200);
      expect(body).toEqual({
        id: media.id,
        title: media.title,
        username: media.username,
        createdAt: media.createdAt.toISOString(),
        updatedAt: media.updatedAt.toISOString(),
      });
    });
  });

  describe('/medias/:id (PATCH)', () => {
    it('should return 409 when there is already a username and title registered', async () => {
      const media = await mediaFactory.create(
        'Instagram',
        'https://www.instagram.com/USERNAME',
      );
      const { status } = await server.patch(`/medias/${media.id}`).send(media);

      expect(status).toBe(409);
    });

    it('should return 200 with media updated', async () => {
      const media = await mediaFactory.create(
        'Instagram',
        'https://www.instagram.com/USERNAME',
      );

      const { body, status } = await server.patch(`/medias/${media.id}`).send({
        title: 'Novo Valor',
      });

      expect(status).toBe(200);
      expect(body).toEqual(
        expect.objectContaining({
          id: media.id,
          title: 'Novo Valor',
          username: media.username,
        }),
      );
    });
  });

  describe('/medias/:id (DELETE)', () => {
    it('should return 404 when theres no media with provided id', async () => {
      await mediaFactory.create(
        'Instagram',
        'https://www.instagram.com/USERNAME',
      );
      const { status } = await server.delete(`/medias/9999`);

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

      const { status } = await server.delete(`/medias/${media.id}`);

      expect(status).toBe(403);
    });
  });
});
