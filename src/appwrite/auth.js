import conf from '../conf/config.js';
import { Client, Account, ID } from 'appwrite'


export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.projectId);
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            console.error(error);
            throw new Error('Failed to create account');
        }
    }

    async login({ email, password }) {
        try {
            await this.account.createEmailSession(email, password);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to login');
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite serive :: getCurrentUser :: error", error);
        }

        return null;
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            throw new Error
        }
    }
}

const authService = new AuthService();

export default authService;