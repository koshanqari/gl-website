// Rename event_* columns to project_* for more generic use
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function renameColumns() {
  const client = await pool.connect();
  
  try {
    console.log('📋 Renaming columns from event_* to project_*...\n');
    
    const renames = [
      { old: 'event_date', new: 'project_date' },
      { old: 'event_country', new: 'project_country' },
      { old: 'event_region', new: 'project_region' },
      { old: 'event_city', new: 'project_city' },
      { old: 'event_pincode', new: 'project_pincode' },
      { old: 'guest_count', new: 'target_count' }
    ];

    for (const { old, new: newName } of renames) {
      await client.query(`
        ALTER TABLE leads 
        RENAME COLUMN ${old} TO ${newName};
      `);
      console.log(`✅ Renamed: ${old} → ${newName}`);
    }
    
    console.log('\n✅ All columns renamed successfully!');
    console.log('\nNew column names:');
    console.log('  - project_date');
    console.log('  - project_country');
    console.log('  - project_region');
    console.log('  - project_city');
    console.log('  - project_pincode');
    console.log('  - target_count');
    
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

renameColumns();
