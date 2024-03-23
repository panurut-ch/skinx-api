import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const roundsOfHashing = 10;

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

    // Seed users
    await seedUsers();
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function seedUsers(): Promise<void> {
  try {
    // create two dummy users
    const passwordPanurut = await bcrypt.hash('password-panurut', roundsOfHashing);
    const passwordSkinx = await bcrypt.hash('password-skinx', roundsOfHashing);

    const user1 = await prisma.user.upsert({
      where: { email: 'panurut@panurut.dev' },
      update: {
        password: passwordPanurut,
      },
      create: {
        email: 'panurut@panurut.dev',
        name: 'Panurut Chinakul',
        password: passwordPanurut,
      },
    });

    const user2 = await prisma.user.upsert({
      where: { email: 'skinx@skinx.com' },
      update: {
        password: passwordSkinx,
      },
      create: {
        email: 'skinx@skinx.com',
        name: 'Skinx App',
        password: passwordSkinx,
      },
    });

    console.log('Users seeding completed.');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

const jsonFilePath = 'prisma/posts.json';
seedDataFromJson(jsonFilePath);
