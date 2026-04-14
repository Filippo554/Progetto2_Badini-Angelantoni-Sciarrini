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