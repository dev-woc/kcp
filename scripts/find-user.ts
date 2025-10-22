import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findUser() {
  try {
    // Search for users with similar email
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: 'laurenceau',
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (users.length === 0) {
      console.log('No users found with "laurenceau" in email');

      // Show all users instead
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true
        }
      });

      console.log('\nAll users in database:');
      console.log(allUsers);
    } else {
      console.log('Found users:');
      console.log(users);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findUser();
