import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MediasModule } from '@/medias/medias.module';
import { Helpers } from './helpers';
import { MediaFactory } from './factories/media.factory';

const helper = new Helpers();
const mediaFactory = new MediaFactory();

describe('MediasController (e2e)', () => {
  let app: INestApplication;
  let server: request.SuperTest<request.Test>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MediasModule],
    }).compile();

    await helper.cleanDb();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = request(app.getHttpServer());
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
});
