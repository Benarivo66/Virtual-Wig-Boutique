import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { NextResponse } from 'next/server';
// import { users, products } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// async function resetDatabase(sql: postgres.Sql) {
//   await sql`DROP TABLE IF EXISTS wig_products;`;
//   await sql`DROP TABLE IF EXISTS wig_users;`;
// }

async function resetDatabase(sql: postgres.Sql) {
  await sql`TRUNCATE TABLE products RESTART IDENTITY CASCADE;`;
  await sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`;
}


async function createUserTable(sql: postgres.Sql) {
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
}

async function createProductTable(sql: postgres.Sql) {
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
}

async function createReviewTable(sql: postgres.Sql) {
  await sql`
    CREATE TABLE wig_reviews (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      product_id UUID NOT NULL REFERENCES wig_products(id) ON DELETE CASCADE,
      review TEXT NOT NULL,
      rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
}

async function createRequestTable(sql: postgres.Sql) {
  await sql`
    CREATE TABLE request (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      total_amount DECIMAL(10, 2) NOT NULL,
      payment_reference TEXT,
      status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'shipped')),
      phone TEXT,
      address TEXT, 
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE request_product (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      request_id UUID NOT NULL REFERENCES request(id) ON DELETE CASCADE,
      product_id UUID NOT NULL REFERENCES products(id),
      name TEXT NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL
    );
  `;
}



export async function GET() {
  try {
    await sql.begin(async (sql) => {
      // await resetDatabase(sql);
      // await createUserTable(sql);
      // await createProductTable(sql);
      await createRequestTable(sql);
      // await createReviewTable(sql);
    });

    return NextResponse.json({ message: 'Request table created successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
