import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin() {
  const email = 'B.laurenceau1908@gmail.com';

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log(`User with email ${email} not found. Please sign up first.`);
      return;
    }

    if (user.role === 'admin') {
      console.log(`User ${email} is already an admin.`);
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'admin' }
    });

    console.log(`✓ Successfully made ${email} an admin`);
    console.log('User details:', {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
