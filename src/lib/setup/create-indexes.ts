/**
 * Appwrite Index Creation Script
 *
 * This script creates all required indexes for optimal query performance.
 * Run this script once after setting up your Appwrite database.
 *
 * Note: This script requires manual index creation through the Appwrite Console
 * as the Node.js SDK does not support programmatic index creation.
 *
 * Usage:
 * 1. Review the index configurations below
 * 2. Create indexes manually in Appwrite Console
 * 3. Or use the Appwrite CLI for automation
 */

import { DATABASE_ID, COLLECTIONS } from '@/lib/constants/database';

// Index types
type IndexType = 'key' | 'fulltext' | 'unique';

interface IndexConfig {
  key: string;
  type: IndexType;
  attributes: string[];
  orders?: string[];
}

// Index configurations for each collection
const indexConfigs: Record<string, IndexConfig[]> = {
  [COLLECTIONS.ANIMALS]: [
    {
      key: 'type_status',
      type: 'key',
      attributes: ['type', 'status'],
      orders: ['ASC', 'ASC'],
    },
    {
      key: 'packId',
      type: 'key',
      attributes: ['packId'],
      orders: ['ASC'],
    },
    {
      key: 'status_createdAt',
      type: 'key',
      attributes: ['status', '$createdAt'],
      orders: ['ASC', 'DESC'],
    },
    {
      key: 'name_fulltext',
      type: 'fulltext',
      attributes: ['name'],
    },
  ],
  [COLLECTIONS.TERRITORIES]: [
    {
      key: 'assignedVolunteers',
      type: 'key',
      attributes: ['assignedVolunteers'],
      orders: ['ASC'],
    },
    {
      key: 'packSize_updatedAt',
      type: 'key',
      attributes: ['packSize', '$updatedAt'],
      orders: ['DESC', 'DESC'],
    },
  ],
  [COLLECTIONS.TASKS]: [
    {
      key: 'assignedTo_completed_scheduledDate',
      type: 'key',
      attributes: ['assignedTo', 'completed', 'scheduledDate'],
      orders: ['ASC', 'ASC', 'ASC'],
    },
    {
      key: 'type_priority_scheduledDate',
      type: 'key',
      attributes: ['type', 'priority', 'scheduledDate'],
      orders: ['ASC', 'DESC', 'ASC'],
    },
    {
      key: 'animalId_completed',
      type: 'key',
      attributes: ['animalId', 'completed'],
      orders: ['ASC', 'ASC'],
    },
    {
      key: 'territoryId_scheduledDate',
      type: 'key',
      attributes: ['territoryId', 'scheduledDate'],
      orders: ['ASC', 'ASC'],
    },
    {
      key: 'completed_scheduledDate',
      type: 'key',
      attributes: ['completed', 'scheduledDate'],
      orders: ['ASC', 'ASC'],
    },
  ],
  [COLLECTIONS.MEDICAL_RECORDS]: [
    {
      key: 'animalId_date',
      type: 'key',
      attributes: ['animalId', 'date'],
      orders: ['ASC', 'DESC'],
    },
    {
      key: 'type_date',
      type: 'key',
      attributes: ['type', 'date'],
      orders: ['ASC', 'DESC'],
    },
    {
      key: 'followUpRequired_followUpDate',
      type: 'key',
      attributes: ['followUpRequired', 'followUpDate'],
      orders: ['ASC', 'ASC'],
    },
    {
      key: 'animalId_type_date',
      type: 'key',
      attributes: ['animalId', 'type', 'date'],
      orders: ['ASC', 'ASC', 'DESC'],
    },
  ],
  [COLLECTIONS.NOTIFICATIONS]: [
    {
      key: 'recipientId_read_createdAt',
      type: 'key',
      attributes: ['recipientId', 'read', '$createdAt'],
      orders: ['ASC', 'ASC', 'DESC'],
    },
    {
      key: 'recipientId_type_createdAt',
      type: 'key',
      attributes: ['recipientId', 'type', '$createdAt'],
      orders: ['ASC', 'ASC', 'DESC'],
    },
    {
      key: 'recipientId_priority_read',
      type: 'key',
      attributes: ['recipientId', 'priority', 'read'],
      orders: ['ASC', 'DESC', 'ASC'],
    },
    {
      key: 'expiresAt',
      type: 'key',
      attributes: ['expiresAt'],
      orders: ['ASC'],
    },
  ],
  [COLLECTIONS.NOTIFICATION_PREFERENCES]: [
    {
      key: 'userId_unique',
      type: 'unique',
      attributes: ['userId'],
      orders: ['ASC'],
    },
  ],
};

/**
 * Print index configurations in a readable format
 */
function printIndexConfigurations(): void {
  console.log('='.repeat(80));
  console.log('APPWRITE DATABASE INDEX CONFIGURATIONS');
  console.log('='.repeat(80));
  console.log(
    '\nThese indexes must be created manually in the Appwrite Console.'
  );
  console.log(
    'Navigate to: Database > [Collection] > Indexes > Create Index\n'
  );

  for (const [collectionId, indexes] of Object.entries(indexConfigs)) {
    console.log('\n' + '─'.repeat(80));
    console.log(`Collection: ${collectionId}`);
    console.log('─'.repeat(80));

    indexes.forEach((config, index) => {
      console.log(`\n${index + 1}. Index: ${config.key}`);
      console.log(`   Type: ${config.type}`);
      console.log(`   Attributes: ${config.attributes.join(', ')}`);
      if (config.orders) {
        console.log(`   Orders: ${config.orders.join(', ')}`);
      }
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log('TOTAL INDEXES TO CREATE');
  console.log('='.repeat(80));

  let totalIndexes = 0;
  for (const indexes of Object.values(indexConfigs)) {
    totalIndexes += indexes.length;
  }

  console.log(
    `\nTotal: ${totalIndexes} indexes across ${Object.keys(indexConfigs).length} collections\n`
  );
}

/**
 * Generate Appwrite CLI commands for index creation
 */
function generateCLICommands(): void {
  console.log('\n' + '='.repeat(80));
  console.log('APPWRITE CLI COMMANDS');
  console.log('='.repeat(80));
  console.log(
    '\nYou can use these commands with the Appwrite CLI to create indexes:\n'
  );

  for (const [collectionId, indexes] of Object.entries(indexConfigs)) {
    console.log(`\n# ${collectionId}`);

    indexes.forEach(config => {
      const attributes = config.attributes.map(attr => `"${attr}"`).join(' ');
      const orders = config.orders
        ? config.orders.map(order => `"${order}"`).join(' ')
        : '';

      console.log(
        `appwrite databases createIndex \\
  --databaseId "${DATABASE_ID}" \\
  --collectionId "${collectionId}" \\
  --key "${config.key}" \\
  --type "${config.type}" \\
  --attributes ${attributes}${orders ? ` \\\n  --orders ${orders}` : ''}`
      );
      console.log('');
    });
  }
}

/**
 * Main function to display index information
 */
function main(): void {
  printIndexConfigurations();
  generateCLICommands();

  console.log('\n' + '='.repeat(80));
  console.log('NEXT STEPS');
  console.log('='.repeat(80));
  console.log('\n1. Create indexes manually in Appwrite Console, OR');
  console.log('2. Use the Appwrite CLI commands above, OR');
  console.log(
    '3. Refer to docs/QUERY_OPTIMIZATION.md for detailed instructions\n'
  );
}

// Run the script
if (require.main === module) {
  main();
}

export { indexConfigs, printIndexConfigurations, generateCLICommands };
