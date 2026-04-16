import { Component, OnInit, Input } from "@angular/core";

type Slot = {
  room: number;
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
    @Input() width: string = "1200";
    @Input() height: string = "880";
    @Input() innerheight: string = "240";
    @Input() type: string = "full";
    month = 2;

    months = [
        { id: 0, name: 'febrary', days: [0, 27] },
        { id: 1, name: 'march', days: [28, 57] },
        { id: 2, name: 'april', days: [58, 89] },
        { id: 3, name: 'may', days: [90, 119] },
        { id: 4, name: 'june', days: [120, 131] },
    ];

    weeks: Week[] = [];

    ngOnInit() {
        this.buildCalendar();
    }

    buildCalendar() {
        const weeks: Week[] = [];

        const year = 2026;
        const monthIndex = this.months[this.month].id;
        const realMonthIndex = monthIndex + 1;

        const firstDay = new Date(year, realMonthIndex, 1);
        
        const startDate = new Date(firstDay);
        const dayOfWeek = (firstDay.getDay() + 6) % 7;
        startDate.setDate(firstDay.getDate() - dayOfWeek);

        const current = new Date(startDate);

        for (let w = 0; w < 9; w++) {
            const week: Week = [];
            for (let d = 0; d < 7; d++) {
                const slots: Slot[] = [];
                const numSlots = (current.getDate() % 5) + 1;
                for (let i = 0; i < numSlots; i++) {
                    slots.push({ room: ((current.getDate() + i * 7) % 119) + 1 });
                }

                week.push({
                    date: current.getDate(),
                    inMonth: current.getMonth() === realMonthIndex,
                    slots
                });

                current.setDate(current.getDate() + 1);
            }
            weeks.push(week);
        }

        this.weeks = weeks;
    }

    next() {
        if (this.month + 1 < this.months.length) {
            this.month++;
            this.buildCalendar();
        }
    }

    previous() {
        if (this.month - 1 >= 0) {
            this.month--;
            this.buildCalendar();
        }
    }
}