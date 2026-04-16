import { Component } from '@angular/core';

import { Page } from '../../../../shared/components/page/page';
import { CalendarComponent } from '../../../../shared/components/calendar/calendar.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
  imports: [Page, CalendarComponent],
})
export class Calendar {}