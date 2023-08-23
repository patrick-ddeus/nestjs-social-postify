import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll(published: string, after: string) {
    const afterDate = new Date(after);
    const now = new Date();
    const where: Prisma.PublicationWhereInput = {
      AND: [],
    };

    if (published === 'true') {
      ((where.AND as Prisma.PublicationWhereInput[]) || []).push({
        date: {
          lte: now,
        },
      });
    }

    if (afterDate.getDate()) {
      ((where.AND as Prisma.PublicationWhereInput[]) || []).push({
        date: {
          gte: afterDate,
          lte: now,
        },
      });
    }

    return await this.publicationsRepository.listAll({
      where,
    });
  }

  findOne(id: number) {
    return this.publicationsRepository.listOne({ id });
  }

  update(id: number, updatePublicationDto: UpdatePublicationDto) {
    return this.publicationsRepository.update({ id }, updatePublicationDto);
  }

  remove(id: number) {
    return this.publicationsRepository.delete({ id });
  }
}
