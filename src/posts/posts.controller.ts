import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { TagPostDto } from './dto/tag-post.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AllPostDto } from './dto/all-post.dto';
import { SearchPostDto } from './dto/search-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll() {
    console.log('findAll')
    return this.postsService.findAll();
  }

  @Get('/all-tag')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAllTag() {
    console.log('findAllTag')
    return this.postsService.findAllTag();
  }

  @Post('all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAllPaging(@Body() allPostDto: AllPostDto) {
    console.log('findAllPaging')
    return this.postsService.findAllPaging(allPostDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Post('/tag')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findByTag(@Body() tagPostDto: TagPostDto) {
    console.log('findByTag');
    return this.postsService.findByTag(tagPostDto);
  }

  @Post('/search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findByKeyword(@Body() searchPostDto: SearchPostDto) {
    console.log('findByKeyword');
    return this.postsService.findByKeyword(searchPostDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
