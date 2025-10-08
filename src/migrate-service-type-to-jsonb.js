// Migrate service_type from TEXT to JSONB
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrateServiceType() {
  const client = await pool.connect();
  
  try {
    console.log('📋 Migrating service_type column from TEXT to JSONB...\n');
    
    // Step 1: Check existing data
    const existingData = await client.query('SELECT id, service_type FROM leads WHERE service_type IS NOT NULL LIMIT 5');
    console.log(`Found ${existingData.rows.length} leads with service_type data`);
    
    // Step 2: Add new column
    await client.query(`
      ALTER TABLE leads 
      ADD COLUMN IF NOT EXISTS service_type_temp JSONB;
    `);
    console.log('✅ Created temporary JSONB column');
    
    // Step 3: Migrate existing data (convert single values to arrays)
    await client.query(`
      UPDATE leads 
      SET service_type_temp = 
        CASE 
          WHEN service_type IS NOT NULL AND service_type != '' 
          THEN to_jsonb(ARRAY[service_type])
          ELSE NULL
        END;
    `);
    console.log('✅ Migrated existing data to arrays');
    
    // Step 4: Drop old column
    await client.query(`
      ALTER TABLE leads DROP COLUMN service_type;
    `);
    console.log('✅ Dropped old TEXT column');
    
    // Step 5: Rename new column
    await client.query(`
      ALTER TABLE leads RENAME COLUMN service_type_temp TO service_type;
    `);
    console.log('✅ Renamed column to service_type');
    
    // Step 6: Verify
    const verifyData = await client.query('SELECT id, service_type FROM leads WHERE service_type IS NOT NULL LIMIT 5');
    console.log('\n📊 Sample data after migration:');
    verifyData.rows.forEach(row => {
      console.log(`  Lead ${row.id}: ${JSON.stringify(row.service_type)}`);
    });
    
    console.log('\n✅ Migration complete!');
    console.log('   service_type is now JSONB and stores arrays of capability tags');
    
    client.release();
    await pool.end();
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    client.release();
    await pool.end();
    process.exit(1);
  }
}

migrateServiceType();
