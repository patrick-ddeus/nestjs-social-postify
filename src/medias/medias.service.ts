import { Injectable } from '@nestjs/common';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaRepository } from './media.repository';

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

    return this.mediaRepository.update({ id }, updateMediaDto);
  }

  async remove(id: number) {
    const media = await this.mediaRepository.listOne({
      Post: {
        some: {
          mediaId: id,
        },
      },
    });

    if (media) {
      throw new ForbiddenException(
        'You must remove the publication before media',
      );
    }
    try {
      const deletedMedia = await this.mediaRepository.delete({ id });
      return deletedMedia;
    } catch (error) {
      throw new NotFoundException();
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
