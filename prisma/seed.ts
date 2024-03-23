import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function seedDataFromJson(jsonFilePath: string): Promise<void> {
  try {
    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    const data = JSON.parse(jsonData);

    for (const item of data) {
      const tags = await Promise.all(item.tags.map(async (tagName: string) => {
        // Find or create the tag
        let tag = await prisma.tag.findUnique({
          where: {
            name: tagName
          }
        });

        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              name: tagName
            }
          });
        }

        return tag;
      }));

      // Create the post
      const post = await prisma.post.create({
        data: {
          title: item.title,
          content: item.content,
          postedAt: new Date(item.postedAt),
          postedBy: item.postedBy,
          tags: {
            connect: tags.map(tag => ({ id: tag.id }))
          }
        },
        include: {
          tags: true
        }
      });

      console.log('Created post with tags:', post);
    }

    console.log('Data seeding completed.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const jsonFilePath = 'prisma/posts.json';
seedDataFromJson(jsonFilePath);
