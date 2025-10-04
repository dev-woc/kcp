import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@keeppedalingfoundation.org';
  const password = 'Admin123!'; // Change this after first login
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'admin',
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Admin User',
      phone: '000-000-0000',
      role: 'admin',
    },
  });

  console.log('Admin user created/updated:');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('Role:', admin.role);
  console.log('\n⚠️  IMPORTANT: Change the password after your first login!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
