import {Component} from '@angular/core';

import { Page } from '../../../../shared/components/page/page';
import { HeaderComponent } from '../../../../shared/components/header/header';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.html',
    // styleUrl: './calendar.css',
    imports: [Page, HeaderComponent],
})
export class Calendar {}