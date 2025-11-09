import { Client, Account, Databases, Storage, Teams } from 'appwrite';

const client = new Client();

client
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'http://localhost/v1'
  )
  .setProject(
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'ccf-animal-welfare'
  );

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);

export { client };
