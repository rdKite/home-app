import { Client, Account, Databases} from "appwrite";

const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject('68a590160033b8bda5af');

export const account = new Account(client);
export const databases = new Databases(client);