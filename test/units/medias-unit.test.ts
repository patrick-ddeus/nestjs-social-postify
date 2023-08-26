import { MediasService } from '@/medias/medias.service';
import { MediaRepository } from '@/medias/medias.repository';
import { PrismaService } from '@/database';
import { MediaFactory } from '../factories';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

describe('Media unit tests', () => {
  let service: MediasService;
  let repository: MediaRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [MediaRepository, MediasService, PrismaService],
    }).compile();

    repository = moduleRef.get<MediaRepository>(MediaRepository);
    service = moduleRef.get<MediasService>(MediasService);
  });

  describe('service findAll', () => {
    it('Should return all medias', async () => {
      const medias = MediaFactory.build();

      jest.spyOn(repository, 'listAll').mockResolvedValue([medias]);

      const response = await service.findAll();
      expect(response).toEqual(expect.arrayContaining([medias]));
    });
  });

  describe('service findOne', () => {
    it('Should return notFoundException when theres no media with provided id', async () => {
      jest.spyOn(repository, 'listOne').mockResolvedValueOnce(null);

      const response = service.findOne(9999);
      expect(response).rejects.toThrow(new NotFoundException());
    });

    it('Should return media with the provided id', async () => {
      const media = MediaFactory.build();

      jest.spyOn(repository, 'listOne').mockResolvedValueOnce(media);

      const response = service.findOne(1);
      expect(response).resolves.toEqual(media);
    });
  });

  describe('service update', () => {
    it('should return conflict when there is already a username and title registered', async () => {
      jest
        .spyOn(repository, 'listOne')
        .mockResolvedValueOnce(MediaFactory.build());

      const response = service.update(1, MediaFactory.build());
      expect(response).rejects.toThrow(new ConflictException());
    });

    it('Should return media with the provided id', async () => {
      const newMedia = MediaFactory.build();
      jest.spyOn(repository, 'listOne').mockResolvedValueOnce(null);
      jest.spyOn(repository, 'update').mockResolvedValueOnce(newMedia);

      const response = service.update(1, newMedia);
      expect(response).resolves.toEqual(newMedia);
    });
  });

  describe('service delete', () => {
    it('Should return media deleted', async () => {
      const newMedia = MediaFactory.build();
      jest.spyOn(repository, 'delete').mockResolvedValueOnce(newMedia);

      const response = service.remove(1);
      expect(response).resolves.toEqual(newMedia);
    });
  });
});
