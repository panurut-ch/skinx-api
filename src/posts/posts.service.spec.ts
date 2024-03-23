import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from './../prisma/prisma.service';

describe('PostsService', () => {
  let service: PostsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService, PrismaService],
    }).compile();

    service = module.get<PostsService>(PostsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const mockPosts = [
        {
          id: 1,
          title: 'Post 1',
          content: 'Content 1',
          postedAt: new Date(),
          postedBy: 'User 1',
        },
        {
          id: 2,
          title: 'Post 2',
          content: 'Content 2',
          postedAt: new Date(),
          postedBy: 'User 2',
        },
      ];
      jest
        .spyOn(prismaService.post, 'findMany')
        .mockResolvedValue(mockPosts as any);

      const result = await service.findAll();

      expect(result).toEqual(mockPosts);
    });
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto = {
        title: 'New Post',
        content: 'New Content',
        postedAt: new Date(),
        postedBy: 'User 3',
      };
      const newPost = {
        id: 3,
        ...createPostDto,
        postedAt: new Date(),
        postedBy: 'User 3',
      };
      jest
        .spyOn(prismaService.post, 'create')
        .mockResolvedValue(newPost as any);

      const result = await service.create(createPostDto);

      expect(result).toEqual(newPost);
    });
  });

  describe('findOne', () => {
    it('should find a post by id', async () => {
      const postId = 1;
      const mockPost = {
        id: postId,
        title: 'Post 1',
        content: 'Content 1',
        postedAt: new Date(),
        postedBy: 'User 1',
      };
      jest
        .spyOn(prismaService.post, 'findUnique')
        .mockResolvedValue(mockPost as any);

      const result = await service.findOne(postId);

      expect(result).toEqual(mockPost);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const postId = 1;
      const updatePostDto = {
        title: 'Updated Post',
        content: 'Updated Content',
      };
      const updatedPost = {
        id: postId,
        ...updatePostDto,
        postedAt: new Date(),
        postedBy: 'User 1',
      };
      jest
        .spyOn(prismaService.post, 'update')
        .mockResolvedValue(updatedPost as any);

      const result = await service.update(postId, updatePostDto);

      expect(result).toEqual(updatedPost);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      const postId = 1;
      const removedPost = {
        id: postId,
        title: 'Post 1',
        content: 'Content 1',
        postedAt: new Date(),
        postedBy: 'User 1',
      };
      jest
        .spyOn(prismaService.post, 'delete')
        .mockResolvedValue(removedPost as any);

      const result = await service.remove(postId);

      expect(result).toEqual(removedPost);
    });
  });
});
