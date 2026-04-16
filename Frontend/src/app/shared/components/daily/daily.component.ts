import { Component, Input, inject } from "@angular/core";

import { HttpService } from "../../../../core/services/http.service";
import { BackendSession } from "../../../../core/services/sessions.service";
import { WebsocketService } from "../../../../core/services/websocket.service";

@Component({
    selector: 'app-component-daily',
    templateUrl: './daily.component.html',
    styleUrl: './daily.component.css',
    imports: []
})
export class DailyComponent {
    private http = inject(HttpService);
    private backendSession = inject(BackendSession);
    private ws = inject(WebsocketService);

    @Input() width: string = "800";
    @Input() height: string = "550";
    @Input() type: string = "full";

    currentDate = new Date();
    day_id = 0;
    days: { date: string; day: string }[] = [{ date: '', day: '' }];
    prenotations: { day_id: number; hours: string; class: string; room: string }[] = [];

    async ngOnInit(): Promise<void> {
        this.ws.connect();
        this.ws.prenotazioniChanged$.subscribe(() => this.loadDay());
        await this.loadDay();
    }

    private formatDate(date: Date): string {
        return date.toISOString().slice(0, 10);
    }

    private updateHeader(): void {
        const d = this.currentDate;
        this.days = [{
            date: `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`,
            day: d.toLocaleDateString('en-US', { weekday: 'long' }),
        }];
        this.day_id = 0;
    }

    async loadDay(): Promise<void> {
        const token = this.backendSession.sessionToken;
        if (!token) return;

        this.updateHeader();

        const data = await this.http.getPrenotazioni(token, {
            data: this.formatDate(this.currentDate),
        });

        this.prenotations = data.map((item: any) => ({
            day_id: 0,
            hours: `${item.ora_inizio.slice(0,5)}-${item.ora_fine.slice(0,5)}`,
            class: (item.classi ?? []).map((c: any) => c.nome).join(', '),
            room: String(item.aula?.numero ?? ''),
        }));
    }

    async next() {
        const d = new Date(this.currentDate);
        d.setDate(d.getDate() + 1);
        this.currentDate = d;
        await this.loadDay();
    }

    async previous() {
        const d = new Date(this.currentDate);
        d.setDate(d.getDate() - 1);
        this.currentDate = d;
        await this.loadDay();
    }
}