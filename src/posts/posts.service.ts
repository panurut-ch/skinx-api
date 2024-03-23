import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TagPostDto } from './dto/tag-post.dto';
import { Prisma } from '@prisma/client';
import { SearchPostDto } from './dto/search-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: createPostDto,
    });
  }

  findAll() {
    return this.prisma.post.findMany({
      orderBy: { postedAt: 'desc' },
      take: 10,
    });
  }

  findAllPaging(allPostDto) {
    console.log('allPostDto', allPostDto);
    const page = allPostDto.page || 1;
    const perpage = allPostDto.perpage || 10;
    const sortbycolumn = allPostDto.sortbycolumn || 'postedAt';
    const orderby = allPostDto.orderby || 'desc';
    const skip = (page - 1) * perpage;

    const orderBy = {};
    orderBy[sortbycolumn] = orderby;

    return this.prisma.post.findMany({
      orderBy: orderBy,
      take: perpage,
      skip: skip,
      include: {
        tags: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    });
  }

  async findByTag(tagPostDto: TagPostDto) {
    console.log('tagPostDto', tagPostDto);
    const tag = tagPostDto.tag;
    const page = tagPostDto.page || 1;
    const perpage = tagPostDto.perpage || 10;
    const sortbycolumn = tagPostDto.sortbycolumn || 'postedAt';
    const orderby = tagPostDto.orderby || 'desc';
    const skip = (page - 1) * perpage;

    const orderBy = {};
    orderBy[sortbycolumn] = orderby;

    return this.prisma.post.findMany({
      where: {
        tags: {
          some: {
            name: tag,
          },
        },
      },
      orderBy: orderBy,
      take: perpage,
      skip: skip,
      include: {
        tags: true,
      },
    });
  }

  async findByKeyword(searchPostDto: SearchPostDto) {
    console.log('searchPostDto', searchPostDto);
    const keyword = searchPostDto.keyword;
    const page = searchPostDto.page || 1;
    const perpage = searchPostDto.perpage || 10;
    const sortbycolumn = searchPostDto.sortbycolumn || 'postedAt';
    const orderby = searchPostDto.orderby || 'desc';
    const skip = (page - 1) * perpage;

    const orderBy = {};
    orderBy[sortbycolumn] = orderby;

    return this.prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: keyword } },
          { content: { contains: keyword } },
        ],
      },
      orderBy: orderBy,
      take: perpage,
      skip: skip,
      include: {
        tags: true,
      },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async remove(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
