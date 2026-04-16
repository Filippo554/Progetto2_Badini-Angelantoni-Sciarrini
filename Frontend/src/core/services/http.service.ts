import { Injectable } from "@angular/core";

type QueryValue = string | number | boolean | undefined | null;

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private readonly baseUrl = "http://localhost:3000/api/v1";

    private buildHeaders(token: string): HeadersInit {
        return {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    private buildUrl(path: string, query?: Record<string, QueryValue>): string {
        const url = new URL(`${this.baseUrl}${path}`);

        if (query) {
            for (const [key, value] of Object.entries(query)) {
                if (value !== undefined && value !== null && value !== '') {
                    url.searchParams.set(key, String(value));
                }
            }
        }

        return url.toString();
    }

    private async handleResponse(res: Response) {
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data.error || `Http failure response for ${res.url}: ${res.status} ${res.statusText}`);
        }

        return data.data ?? data.user ?? data;
    }

    async authMe(token: string): Promise<any> {
        const res = await fetch(`${this.baseUrl}/auth/me`, {
            method: "GET",
            headers: this.buildHeaders(token)
        });

        return this.handleResponse(res);
    }

    async getPrenotation(token: string): Promise<any[]> {
        const res = await fetch(`${this.baseUrl}/prenotazioni/`, {
            method: "GET",
            headers: this.buildHeaders(token)
        });

        return this.handleResponse(res);
    }

    async getPrenotazioni(token: string, query?: Record<string, QueryValue>): Promise<any[]> {
        const res = await fetch(this.buildUrl('/prenotazioni/', query), {
            method: "GET",
            headers: this.buildHeaders(token)
        });

        return this.handleResponse(res);
    }

    async getPrenotationById(token: string, id: number): Promise<any> {
        const res = await fetch(`${this.baseUrl}/prenotazioni/${id}`, {
            method: "GET",
            headers: this.buildHeaders(token)
        });

        return this.handleResponse(res);
    }

    async createPrenotation(token: string, payload: any): Promise<any> {
        const res = await fetch(`${this.baseUrl}/prenotazioni/`, {
            method: "POST",
            headers: this.buildHeaders(token),
            body: JSON.stringify(payload)
        });

        return this.handleResponse(res);
    }

    async getClasses(token: string): Promise<any[]> {
        const res = await fetch(`${this.baseUrl}/classi/`, {
            method: "GET",
            headers: this.buildHeaders(token)
        });

        return this.handleResponse(res);
    }

    async getRooms(token: string): Promise<any[]> {
        const res = await fetch(`${this.baseUrl}/aule/`, {
            method: "GET",
            headers: this.buildHeaders(token)
        });

        return this.handleResponse(res);
    }
}