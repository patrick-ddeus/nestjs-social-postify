import { Test, TestingModule } from '@nestjs/testing';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';

describe('MediasController', () => {
  let controller: MediasController;
  let service: MediasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediasController],
      providers: [MediasService],
    }).compile();

    controller = module.get<MediasController>(MediasController);
    service = module.get<MediasService>(MediasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should get all media from database', () => {
    expect(service.findAll()).resolves.toEqual([]);
  });
});
