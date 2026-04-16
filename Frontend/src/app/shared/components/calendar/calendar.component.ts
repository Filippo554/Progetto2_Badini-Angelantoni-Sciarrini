import { Component, OnInit, Input, inject } from "@angular/core";

import { HttpService } from "../../../../core/services/http.service";
import { BackendSession } from "../../../../core/services/sessions.service";

type Slot = {
  room: number | string;
};

type Day = {
  date: number;
  inMonth: boolean;
  slots: Slot[];
};

type Week = Day[];

@Component({
    selector: 'app-component-calendar',
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.css',
    imports: []
})
export class CalendarComponent implements OnInit {
    httpService = inject(HttpService);
    backendSession = inject(BackendSession);
    
    @Input() width: string = "1200";
    @Input() height: string = "880";
    @Input() innerheight: string = "240";
    @Input() type: string = "full";

    currentDate = new Date();
    monthName = '';
    weeks: Week[] = [];
    errorMessage = '';

    async ngOnInit() {
        await this.buildCalendar();
    }

    private formatMonthName(date: Date): string {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    }

    private formatDate(date: Date): string {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    async buildCalendar() {
        const token = this.backendSession.sessionToken;

        if (!token) {
            this.errorMessage = 'Token mancante';
            this.weeks = [];
            return;
        }

        this.errorMessage = '';

        const year = this.currentDate.getFullYear();
        const monthIndex = this.currentDate.getMonth();

        this.monthName = this.formatMonthName(this.currentDate);

        const firstDay = new Date(year, monthIndex, 1);
        const startDate = new Date(firstDay);
        const dayOfWeek = (firstDay.getDay() + 6) % 7;
        startDate.setDate(firstDay.getDate() - dayOfWeek);

        try {
            const allPrenotations = await this.httpService.getPrenotation(token);

            const slotsByDate = new Map<string, Slot[]>();

            for (const item of allPrenotations) {
                const key = item.data;
                const room = item.aula?.numero ?? '';

                if (!slotsByDate.has(key)) {
                    slotsByDate.set(key, []);
                }

                slotsByDate.get(key)!.push({ room });
            }

            const weeks: Week[] = [];
            const current = new Date(startDate);

            for (let w = 0; w < 9; w++) {
                const week: Week = [];

                for (let d = 0; d < 7; d++) {
                    const key = this.formatDate(current);
                    const slots = slotsByDate.get(key) ?? [];

                    week.push({
                        date: current.getDate(),
                        inMonth: current.getMonth() === monthIndex,
                        slots
                    });

                    current.setDate(current.getDate() + 1);
                }

                weeks.push(week);
            }

            this.weeks = weeks;
        } catch (error) {
            console.error('Errore calendario:', error);
            this.errorMessage = 'Errore caricamento calendario';
            this.weeks = [];
        }
    }

    async next() {
        this.currentDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() + 1,
            1
        );
        await this.buildCalendar();
    }

    async previous() {
        this.currentDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() - 1,
            1
        );
        await this.buildCalendar();
    }

    getWeek(row: number, col: number): Week {
        return this.weeks[row * 3 + col] ?? [];
    }

    getMaxSlots(week: Week): number[] {
        const max = week.reduce((m, day) => Math.max(m, day.slots.length), 0);
        return Array.from({ length: max }, (_, i) => i);
    }
}