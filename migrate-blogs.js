// Migrate blogs from Supabase to PostgreSQL
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrateBlogs() {
  const client = await pool.connect();
  
  try {
    console.log('📋 STEP 1: Creating blogs table in PostgreSQL...\n');
    
    // Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        read_time TEXT NOT NULL,
        author TEXT NOT NULL,
        featured BOOLEAN DEFAULT false,
        top_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Table created!');
    
    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
      CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(featured);
      CREATE INDEX IF NOT EXISTS idx_blogs_top_featured ON blogs(top_featured);
      CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
    `);
    
    console.log('✅ Indexes created!');
    
    // Create updated_at trigger
    await client.query(`
      CREATE OR REPLACE FUNCTION update_blogs_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      DROP TRIGGER IF EXISTS trigger_blogs_updated_at ON blogs;
      
      CREATE TRIGGER trigger_blogs_updated_at
        BEFORE UPDATE ON blogs
        FOR EACH ROW
        EXECUTE FUNCTION update_blogs_updated_at();
    `);
    
    console.log('✅ Trigger created!');
    
    // Load exported data
    console.log('\n📋 STEP 2: Importing blogs from Supabase...\n');
    const data = JSON.parse(fs.readFileSync('blogs-export.json', 'utf8'));
    
    let imported = 0;
    for (const blog of data) {
      await client.query(`
        INSERT INTO blogs (
          id, title, excerpt, content, image_url, category, 
          date, read_time, author, featured, top_featured, 
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          image_url = EXCLUDED.image_url,
          category = EXCLUDED.category,
          date = EXCLUDED.date,
          read_time = EXCLUDED.read_time,
          author = EXCLUDED.author,
          featured = EXCLUDED.featured,
          top_featured = EXCLUDED.top_featured,
          updated_at = CURRENT_TIMESTAMP
      `, [
        blog.id,
        blog.title,
        blog.excerpt,
        blog.content,
        blog.image_url,
        blog.category,
        blog.date,
        blog.read_time,
        blog.author,
        blog.featured,
        blog.top_featured,
        blog.created_at,
        blog.updated_at
      ]);
      
      console.log(`   ✅ Imported: ${blog.title}`);
      imported++;
    }
    
    console.log(`\n✅ Successfully imported ${imported} blogs!`);
    
    // Verify
    const result = await client.query('SELECT COUNT(*) as count FROM blogs');
    console.log(`\n📊 Total blogs in PostgreSQL: ${result.rows[0].count}`);
    
    client.release();
    await pool.end();
    
    console.log('\n🎉 Migration complete!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    client.release();
    await pool.end();
    process.exit(1);
  }
}

migrateBlogs();
