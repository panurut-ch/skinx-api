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
      include: {
        tags: true,
      },
    });
  }

  findAllTag() {
    return this.prisma.tag.findMany({
      orderBy: { id: 'asc' },
    });
  }

  // findAllPaging(allPostDto) {
  //   console.log('allPostDto', allPostDto);
  //   const page = allPostDto.page || 1;
  //   const perpage = allPostDto.perpage || 10;
  //   const sortbycolumn = allPostDto.sortbycolumn || 'postedAt';
  //   const orderby = allPostDto.orderby || 'desc';
  //   const skip = (page - 1) * perpage;

  //   const orderBy = {};
  //   orderBy[sortbycolumn] = orderby;

  //   return this.prisma.post.findMany({
  //     orderBy: orderBy,
  //     take: perpage,
  //     skip: skip,
  //     include: {
  //       tags: true,
  //     },
  //   });
  // }
  async findAllPaging(allPostDto): Promise<{ data: any[]; total: number }> {
    console.log('allPostDto', allPostDto);
    const page = allPostDto.page || 1;
    const perpage = allPostDto.perpage || 10;
    const sortbycolumn = allPostDto.sortbycolumn || 'postedAt';
    const orderby = allPostDto.orderby || 'desc';
    const skip = (page - 1) * perpage;

    const orderBy = {};
    orderBy[sortbycolumn] = orderby;

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        orderBy: orderBy,
        take: perpage,
        skip: skip,
        include: {
          tags: true,
        },
      }),
      this.prisma.post.count(),
    ]);

    return { data, total };
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

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
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
      }),
      this.prisma.post.count({
        where: {
          tags: {
            some: {
              name: tag,
            },
          },
        },
      }),
    ]);

    return { data, total };
  }

  // async findByKeyword(
  //   searchPostDto: SearchPostDto,
  // ): Promise<{ data: any[]; total: number }> {
  //   console.log('searchPostDto', searchPostDto);
  //   const keyword = searchPostDto.keyword;
  //   const page = searchPostDto.page || 1;
  //   const perpage = searchPostDto.perpage || 10;
  //   const sortbycolumn = searchPostDto.sortbycolumn || 'postedAt';
  //   const orderby = searchPostDto.orderby || 'desc';
  //   const skip = (page - 1) * perpage;

  //   const orderBy = {};
  //   orderBy[sortbycolumn] = orderby;

  //   const [data, total] = await Promise.all([
  //     this.prisma.post.findMany({
  //       where: {
  //         OR: [
  //           { title: { contains: keyword } },
  //           { content: { contains: keyword } },
  //         ],
  //       },
  //       orderBy: orderBy,
  //       take: perpage,
  //       skip: skip,
  //       include: {
  //         tags: true,
  //       },
  //     }),
  //     this.prisma.post.count(),
  //   ]);

  //   return { data, total };
  // }
  async findByKeyword(
    searchPostDto: SearchPostDto,
  ): Promise<{ data: any[]; total: number }> {
    console.log('searchPostDto', searchPostDto);
    const keyword = searchPostDto.keyword;
    const page = searchPostDto.page || 1;
    const perpage = searchPostDto.perpage || 10;
    const sortbycolumn = searchPostDto.sortbycolumn || 'postedAt';
    const orderby = searchPostDto.orderby || 'desc';
    const skip = (page - 1) * perpage;
    const tag = searchPostDto.tag || '';

    const orderBy = {};
    orderBy[sortbycolumn] = orderby;

    const where: Prisma.PostWhereInput = {
      OR: [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
      ],
    };

    if (tag) {
      where.tags = {
        some: {
          name: tag,
        },
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        orderBy: orderBy,
        take: perpage,
        skip: skip,
        include: {
          tags: true,
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return { data, total };
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
