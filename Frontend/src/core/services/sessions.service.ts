import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class GoogleSession {
    private readonly clientId = '610359570962-mf8sfiilrkn2bh606qe1t61b17l4n8jf.apps.googleusercontent.com';
    private credentials = '';

    public get sessionClientId(): string {
        return this.clientId;
    }

    public set sessionCredentials(cred: string) {
        this.credentials = cred;
    }

    public get sessionCredentials(): string {
        return this.credentials;
    }
}

@Injectable({ providedIn: 'root' })
export class BackendSession {
    private readonly storageKey = 'backend_token';
    private token: string | null = null;
    
    constructor() {
        this.token = sessionStorage.getItem(this.storageKey);
    }

    public get sessionToken(): string {
        return this.token ?? '';
    }

    public initialize(token: string): void {
        this.token = token;
        sessionStorage.setItem(this.storageKey, token);
    }

    public clear(): void {
        this.token = null;
        sessionStorage.removeItem(this.storageKey);
    }

    public isNull(): boolean {
        return this.token === null || this.token === '';
    }
}