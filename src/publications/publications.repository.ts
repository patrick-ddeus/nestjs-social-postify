import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma, Publication } from '@prisma/client';

@Injectable()
export class PublicationsRepository {
  constructor(private prisma: PrismaService) {}

  create(
    data:
      | Prisma.PublicationCreateInput
      | Prisma.PublicationUncheckedCreateInput,
  ): Promise<Publication> {
    return this.prisma.publication.create({
      data,
    });
  }

  listAll(args: Prisma.PublicationFindManyArgs = {}): Promise<Publication[]> {
    return this.prisma.publication.findMany(args);
  }

  listOne(where: Prisma.PublicationWhereInput): Promise<Publication> {
    return this.prisma.publication.findFirst({
      where,
    });
  }

  update(
    where: Prisma.PublicationWhereUniqueInput,
    data:
      | Prisma.PublicationUpdateInput
      | Prisma.PublicationUncheckedUpdateInput,
  ) {
    return this.prisma.publication.update({
      where,
      data,
    });
  }

  delete(where: Prisma.PublicationWhereUniqueInput) {
    return this.prisma.publication.delete({
      where,
    });
  }
}
