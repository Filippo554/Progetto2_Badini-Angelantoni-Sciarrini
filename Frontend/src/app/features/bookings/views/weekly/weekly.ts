import { Component } from '@angular/core';
import { Page } from '../../../../shared/components/page/page';
import { WeeklyComponent } from '../../../../shared/components/weekly/weekly.component';



@Component({
    selector: 'app-weekly',
    templateUrl: './weekly.html',
    styleUrl: './weekly.css',
    imports: [Page, WeeklyComponent],
})
export class Weekly {}