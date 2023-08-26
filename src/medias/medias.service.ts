import { Injectable } from '@nestjs/common';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaRepository } from './medias.repository';
import { exclude } from '../common/helper/prisma-utils';

@Injectable()
export class MediasService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async create(createMediaDto: CreateMediaDto) {
    const { username, title } = createMediaDto;
    await this.checkUsernameConflict(username, title);

    return this.mediaRepository.create(createMediaDto);
  }

  findAll() {
    return this.mediaRepository.listAll();
  }

  async findOne(id: number) {
    const medias = await this.mediaRepository.listOne({ id });

    if (!medias) {
      throw new NotFoundException();
    }

    return medias;
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    const { username, title } = updateMediaDto;
    await this.checkUsernameConflict(username, title);

    const mediaUpdated = await this.mediaRepository.update(
      { id },
      updateMediaDto,
    );
    return mediaUpdated;
  }

  async remove(id: number) {
    try {
      const deletedMedia = await this.mediaRepository.delete({ id });
      return deletedMedia;
    } catch (error) {
      if (error.code === 'P2003')
        throw new ForbiddenException(
          'You must remove the publication before media',
        );
      if (error.code === 'P2025') throw new NotFoundException();
    }
  }

  private async checkUsernameConflict(username: string, title: string) {
    const user = await this.mediaRepository.listOne({
      AND: [
        {
          username,
        },
        {
          title,
        },
      ],
    });

    if (user) {
      throw new ConflictException();
    }
  }
}
