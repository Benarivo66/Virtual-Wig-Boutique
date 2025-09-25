import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { NextResponse } from 'next/server';
import { users, products } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// async function resetDatabase(sql: postgres.Sql) {
//   await sql`DROP TABLE IF EXISTS products;`;
//   await sql`DROP TABLE IF EXISTS users;`;
// }

async function resetDatabase(sql: postgres.Sql) {
  await sql`TRUNCATE TABLE products RESTART IDENTITY CASCADE;`;
  await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`;
}


async function seedUsers(sql: postgres.Sql) {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'admin'))
    );
  `;

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${user.name}, ${user.email}, ${hashedPassword}, ${user.role})
      ON CONFLICT (email) DO NOTHING;
    `;
  }
}

async function seedProducts(sql: postgres.Sql) {
  await sql`
    CREATE TABLE products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT,
      video_url TEXT,
      average_rating TEXT
    );
  `;

  for (const product of products) {
    await sql`
      INSERT INTO products (name, description, price, category, image_url, video_url, average_rating)
      VALUES (${product.name}, ${product.description}, ${product.price}, ${product.category}, ${product.image_url}, ${product.video_url}, ${product.average_rating})
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

export async function GET() {
  try {
    await sql.begin(async (sql) => {
      await resetDatabase(sql);
      // await seedUsers(sql);
      // await seedProducts(sql);
    });

    return NextResponse.json({ message: 'Database reset' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
