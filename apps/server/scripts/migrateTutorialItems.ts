import 'dotenv/config';
import pg from 'pg';

const sql = `
CREATE TABLE IF NOT EXISTS tutorial_items (
  id text PRIMARY KEY,
  type varchar(20) NOT NULL,
  parent_id text,
  title varchar(300) NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  grid_max_width varchar(50),
  description text,
  description_secondary text,
  publisher varchar(200),
  published_year varchar(10),
  duration varchar(50),
  tags text,
  video_url text,
  trailer_url text,
  pdf_url text,
  thumbnail_url text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

DROP TABLE IF EXISTS tutorial_videos CASCADE;
DROP TABLE IF EXISTS tutorial_quickguides CASCADE;
DROP TABLE IF EXISTS tutorial_video_sections CASCADE;
`;

async function main() {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log('Tutorial items table migrated successfully');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
