import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TagPostDto } from './dto/tag-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  findAll() {
    return this.prisma.post.findMany({
      orderBy: { postedAt: 'desc' },
      take: 10,
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async findByTag(tagPostDto: TagPostDto) {
    console.log('tagPostDto', tagPostDto)
    const tag = tagPostDto.tag;
    return this.prisma.post.findMany({
      where: {
        tags: {
          some: {
            name: tag,
          },
        },
      },
    });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
