import { Component, Input } from "@angular/core";

interface Slot {
    hours: string;
    class: string;
    room: string;
}

interface Row {
    id: number;
    mon: Slot | string;
    tue: Slot | string;
    wed: Slot | string;
    thu: Slot | string;
    fri: Slot | string;
    sat: Slot | string;
    sun: Slot | string;
}

@Component({
    selector: 'app-component-weekly',
    templateUrl: './weekly.component.html',
    styleUrl: './weekly.component.css',
    imports: []
})
export class WeeklyComponent {
    @Input() width: string = "800";
    @Input() height: string = "550";
    @Input() type: string = "full";
    week = 3;
    weeks = [
        {
            days: '06-12',
            monday:    [ { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            tuesday:   [ { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            wednesday: [ { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            thursday:  [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            friday:    [ { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            saturday:  [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            sunday:    [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
        },
        {
            days: '13-19',
            monday:    [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            tuesday:   [ { hours: '08:00-09:00', class: '5BIA', room: '119' }, { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            wednesday: [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            thursday:  [],
            friday:    [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            saturday:  [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            sunday:    [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
        },
        {
            days: '20-26',
            monday:    [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            tuesday:   [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            wednesday: [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            thursday:  [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            friday:    [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            saturday:  [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            sunday:    [],
        },
        {
            days: '27-03',
            monday:    [],
            tuesday:   [],
            wednesday: [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            thursday:  [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            friday:    [],
            saturday:  [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            sunday:    [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
        },
        {
            days: '04-10',
            monday:    [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            tuesday:   [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            wednesday: [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            thursday:  [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            friday:    [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            saturday:  [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
            sunday:    [ { hours: '08:00-09:00', class: '5BIA', room: '119' } ],
        },
    ];

    rows: Row[] = [];

    ngOnInit() {
        this.rows = this.getRows();
    }

    asSlot(val: Slot | string): Slot {
        return val as Slot;
    }

    getRows(): Row[] {
        const week = this.weeks[this.week];
        const n = Math.max(
            week.monday.length,
            week.tuesday.length,
            week.wednesday.length,
            week.thursday.length,
            week.friday.length,
            week.saturday.length,
            week.sunday.length
        );
        const rows: Row[] = [];
        for (let i = 0; i < n; i++) {
            rows.push({
                id:  i,
                mon: i < week.monday.length    ? week.monday[i]    : '',
                tue: i < week.tuesday.length   ? week.tuesday[i]   : '',
                wed: i < week.wednesday.length ? week.wednesday[i] : '',
                thu: i < week.thursday.length  ? week.thursday[i]  : '',
                fri: i < week.friday.length    ? week.friday[i]    : '',
                sat: i < week.saturday.length  ? week.saturday[i]  : '',
                sun: i < week.sunday.length    ? week.sunday[i]    : '',
            });
        }
        return rows;
    }

    previous() {
        if (this.week - 1 >= 0) {
            this.week -= 1;
            this.rows = this.getRows();
        }
    }

    next() {
        if (this.week + 1 < this.weeks.length) {
            this.week += 1;
            this.rows = this.getRows();
        }
    }
}