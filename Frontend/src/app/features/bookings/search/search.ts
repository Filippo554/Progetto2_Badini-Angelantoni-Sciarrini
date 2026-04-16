import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Page } from '../../../shared/components/page/page';
import { HttpService } from '../../../../core/services/http.service';
import { BackendSession } from '../../../../core/services/sessions.service';
import { WebsocketService } from '../../../../core/services/websocket.service';

type SearchRow = {
    id: number;
    hours: string;
    startHour: string;
    endHour: string;
    classes: string;
    classesList: string[];
    room: string;
};

@Component({
    selector: 'app-search',
    templateUrl: './search.html',
    styleUrl: './search.css',
    imports: [Page, FormsModule],
})
export class Search {
    private http = inject(HttpService);
    private backendSession = inject(BackendSession);
    private ws = inject(WebsocketService);
    private router = inject(Router);

    allRows: SearchRow[] = [];
    pr: SearchRow[] = [];

    classes: { c: string }[] = [];
    rooms: { n: string }[] = [];

    selectedClass = '';
    selectedRoom = '';
    selectedStartHour = '';
    selectedEndHour = '';

    isLoading = false;
    errorMessage = '';

    async ngOnInit(): Promise<void> {
        this.ws.connect();
        this.ws.prenotazioniChanged$.subscribe(() => this.loadData());
        await this.loadData();
    }

    async loadData(): Promise<void> {
        const token = this.backendSession.sessionToken;
        if (!token) {
            this.errorMessage = 'Token mancante';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        try {
            const data = await this.http.getPrenotazioni(token);

            this.allRows = data.map((item: any) => {
                const classesList = Array.isArray(item.classi)
                    ? item.classi.map((c: any) => c.nome)
                    : [];

                return {
                    id: item.id,
                    hours: `${item.ora_inizio.slice(0,5)}-${item.ora_fine.slice(0,5)}`,
                    startHour: item.ora_inizio.slice(0,5),
                    endHour: item.ora_fine.slice(0,5),
                    classes: classesList.join(', '),
                    classesList,
                    room: String(item.aula?.numero ?? ''),
                };
            });

            this.pr = [...this.allRows];

            const classSet = new Set<string>();
            const roomSet = new Set<string>();

            for (const row of this.allRows) {
                row.classesList.forEach(c => classSet.add(c));
                if (row.room) roomSet.add(row.room);
            }

            this.classes = Array.from(classSet).sort().map(c => ({ c }));
            this.rooms = Array.from(roomSet).sort((a, b) => Number(a) - Number(b)).map(n => ({ n }));
        } catch (error) {
            console.error(error);
            this.errorMessage = 'Errore nel caricamento delle prenotazioni.';
        } finally {
            this.isLoading = false;
        }
    }

    applyFilters(): void {
        this.pr = this.allRows.filter(row => {
            const classOk = !this.selectedClass || row.classesList.includes(this.selectedClass);
            const roomOk = !this.selectedRoom || row.room === this.selectedRoom;
            const startOk = !this.selectedStartHour || row.startHour >= this.selectedStartHour;
            const endOk = !this.selectedEndHour || row.endHour <= this.selectedEndHour;

            return classOk && roomOk && startOk && endOk;
        });
    }

    resetFilters(): void {
        this.selectedClass = '';
        this.selectedRoom = '';
        this.selectedStartHour = '';
        this.selectedEndHour = '';
        this.pr = [...this.allRows];
    }

    openDetail(id: number): void {
        this.router.navigate(['/detail'], { queryParams: { id } });
    }
}