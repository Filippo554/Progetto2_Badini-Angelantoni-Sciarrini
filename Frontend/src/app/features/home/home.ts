import { Component } from '@angular/core';

import { Page } from '../../shared/components/page/page';
import { DailyComponent } from '../../shared/components/daily/daily.component';
import { WeeklyComponent } from '../../shared/components/weekly/weekly.component';
import { LinkComponent } from '../../shared/components/link/link.component';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.html',
    styleUrl: './home.css',
    imports: [Page, DailyComponent, WeeklyComponent, CalendarComponent, LinkComponent],
})
export class Home {}