import {Component} from '@angular/core';

import { Page } from '../../../shared/components/page/page';
import { HeaderComponent } from '../../../shared/components/header/header';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.html',
    styleUrl: './detail.css',
    imports: [Page, HeaderComponent],
})
export class Detail {
    prenotation = {
        classes: [ {id: 0, c: '5BIA'}, {id: 1, c: '5CIA'}, {id: 2, c: '5DIA'} ],
        room: 119,
        date: '17/04/2026',
        start: '08:00',
        end: '10:00',
        teacher: 'Ferraro Patrizia'
    }
}