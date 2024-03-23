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
      // Mock the return value of prismaService.post.findMany
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

      // Call the findAll method
      const result = await service.findAll();

      // Check if the result matches the mocked posts
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

      // Call the create method
      const result = await service.create(createPostDto);

      // Check if the result matches the newly created post
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

      // Call the findOne method
      const result = await service.findOne(postId);

      // Check if the result matches the mocked post
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
        postedAt: new Date(), // Adjust this date if needed to match the expected output
        postedBy: 'User 1', // Ensure this matches the expected postedBy value
      };
      jest
        .spyOn(prismaService.post, 'update')
        .mockResolvedValue(updatedPost as any);

      // Call the update method
      const result = await service.update(postId, updatePostDto);

      // Check if the result matches the updated post
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
        postedAt: new Date(), // Adjust this date if needed to match the expected output
        postedBy: 'User 1', // Ensure this matches the expected postedBy value
      };
      jest
        .spyOn(prismaService.post, 'delete')
        .mockResolvedValue(removedPost as any);

      // Call the remove method
      const result = await service.remove(postId);

      // Check if the result matches the removed post
      expect(result).toEqual(removedPost);
    });
  });

  // Add more test cases for other methods if needed
});
