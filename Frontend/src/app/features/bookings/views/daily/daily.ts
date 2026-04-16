import {Component} from '@angular/core';

import { Page } from '../../../../shared/components/page/page';
import { DailyComponent } from '../../../../shared/components/daily/daily.component';

@Component({
    selector: 'app-daily',
    templateUrl: './daily.html',
    styleUrl: './daily.css',
    imports: [Page, DailyComponent],
})
export class Daily {}