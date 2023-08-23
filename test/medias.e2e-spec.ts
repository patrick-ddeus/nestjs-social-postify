import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MediasModule } from '@/medias/medias.module';
import { Helpers } from './helpers';
import { MediaFactory } from './factories/media.factory';

const helper = new Helpers();
const mediaFactory = new MediaFactory();

beforeAll(async () => {
  helper.cleanDb();
});

describe('MediaController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MediasModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/medias (GET)', async () => {
    const media = await mediaFactory.create(
      'Instagram',
      'https://www.instagram.com/USERNAME',
    );

    return request(app.getHttpServer())
      .get('/medias')
      .expect(200)
      .expect([
        {
          id: media.id,
          title: media.title,
          username: media.username,
          createdAt: media.createdAt.toISOString(),
          updatedAt: media.updatedAt.toISOString(),
        },
      ]);
  });
});
