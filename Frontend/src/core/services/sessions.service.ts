import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SessionService {
    private GOOGLE_CLIENT_ID = '610359570962-mf8sfiilrkn2bh606qe1t61b17l4n8jf.apps.googleusercontent.com';

    private GOOGLE_CLIENT_CREDENTIALS = '';
    private SESSION_TOKEN = '';

    public get_client_id() {
        return this.GOOGLE_CLIENT_ID;
    }
    public get_credentials() {
        return this.GOOGLE_CLIENT_CREDENTIALS;
    }
    public set_credentials(credentials: string) {
        this.GOOGLE_CLIENT_CREDENTIALS = credentials;
        return 0;
    }
    public get_session_token() {
        return this.SESSION_TOKEN;
    }
    public set_session_token(token: string) {
        this.SESSION_TOKEN = token;
        return 0;
    }
}

@Injectable({ providedIn: 'root' })
export class GoogleSession {
    private clientId = '610359570962-mf8sfiilrkn2bh606qe1t61b17l4n8jf.apps.googleusercontent.com';
    private credentials!: string;

    public set sessionCredentials(cred: string) {
        this.credentials = cred;
    }
    public get sessionCredentials() {
        return this.credentials;
    }
}
@Injectable({ providedIn: 'root' })
export class BackendSession {
    private token: string | null = null;
    
    public get sessionToken() {
        if (this.token !== null) {
            return this.token;
        } else {
            return '';
        }
    }

    public initialize(token: string): void {
        this.token = token;
    }
    public clear(): void {
        this.token = null;
    }
    public isNull(): boolean {
        return this.token === null;
    }
}