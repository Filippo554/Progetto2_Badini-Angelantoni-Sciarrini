import {Component} from '@angular/core';

import { Page } from '../../../shared/components/page/page';
import { HeaderComponent } from '../../../shared/components/header/header';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.html',
    // styleUrl: './detail.css',
    imports: [Page, HeaderComponent],
})
export class Detail {}