import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-component-daily',
    templateUrl: './daily.component.html',
    styleUrl: './daily.component.css',
    imports: []
})
export class DailyComponent {
    @Input() width: string = "800";
    @Input() height: string = "550";
    @Input() type: string = "full";
    day_id = 11;
    days = [
        { date: '05/04/2006', day: 'Sunday' },
        { date: '06/04/2006', day: 'Monday' },
        { date: '07/04/2006', day: 'Tuesday' },
        { date: '08/04/2006', day: 'Wednesday' },
        { date: '09/04/2006', day: 'Thursday' },
        { date: '10/04/2006', day: 'Friday' },
        { date: '11/04/2006', day: 'Saturday' },
        { date: '12/04/2006', day: 'Sunday' },
        { date: '13/04/2006', day: 'Monday' },
        { date: '14/04/2006', day: 'Tuesday' },
        { date: '15/04/2006', day: 'Wednesday' },
        { date: '16/04/2006', day: 'Thursday' },
        { date: '17/04/2006', day: 'Friday' },
        { date: '18/04/2006', day: 'Saturday' },
        { date: '19/04/2006', day: 'Sunday' },
    ]
    prenotations = [
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 0, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 1, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 1, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 1, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 1, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 1, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 2, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 2, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 2, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 2, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 2, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 2, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 2, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 3, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 3, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 3, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 3, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 4, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 4, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 4, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 4, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 4, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 5, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 5, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 5, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 5, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 5, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 5, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 6, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 6, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 6, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 7, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 7, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 7, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 7, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 7, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 8, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 8, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 8, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 8, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 8, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 9, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 9, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 9, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 10, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 10, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 10, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 11, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 11, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 11, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 11, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 11, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 12, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 12, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 12, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 12, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 13, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 13, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 13, hours: '08:00-09:00', class: '5BIA', room: '119' },
        { day_id: 14, hours: '08:00-09:00', class: '5BIA', room: '119' },
    ];
    next() {
        if (this.day_id+1 < this.days.length) {
            this.day_id += 1;
        }
    }
    previous() {
        if (this.day_id-1 >= 0) {
            this.day_id -= 1;
        }
    }
}