import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // ✅ or your self-hosted URL
  .setProject('67f40c9b0034952cd941'); // ✅ your actual project ID

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage };
