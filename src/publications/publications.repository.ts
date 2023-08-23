import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

Injectable();
export class PublicationsRepository {
  constructor(private readonly prismaService: PrismaService) {}
}
