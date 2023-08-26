import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly publicationsRepository: PublicationsRepository,
  ) {}

  async create(createPublicationDto: CreatePublicationDto) {
    const { mediaId, postId, date } = createPublicationDto;
    try {
      const publication = await this.publicationsRepository.create({
        media: {
          connect: {
            id: mediaId,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
        date,
      });
      return publication;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          'One or more required records were not found.',
        );
      }
    }
  }

  async findAll(published: boolean, after: Date) {
    const now = new Date();
    const where: Prisma.PublicationWhereInput = {
      AND: [],
    };

    if (published) {
      (where.AND as Prisma.PublicationWhereInput[]).push({
        date: {
          lte: now,
        },
      });
    }

    if (after) {
      (where.AND as Prisma.PublicationWhereInput[]).push({
        date: {
          gte: after,
          lte: now,
        },
      });
    }

    return await this.publicationsRepository.listAll({
      where,
    });
  }

  async findOne(id: number) {
    const publication = await this.publicationsRepository.listOne({ id });

    if (!publication) {
      throw new NotFoundException();
    }

    return publication;
  }

  async update(id: number, updatePublicationDto: UpdatePublicationDto) {
    const publicationToUpdate = await this.publicationsRepository.listOne({
      id,
    });
    const now = new Date();

    if (!publicationToUpdate) {
      throw new NotFoundException();
    }

    if (publicationToUpdate.date < now) {
      throw new ForbiddenException();
    }

    return this.publicationsRepository.update({ id }, updatePublicationDto);
  }

  async remove(id: number) {
    try {
      const publication = await this.publicationsRepository.delete({ id });
      return publication;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
