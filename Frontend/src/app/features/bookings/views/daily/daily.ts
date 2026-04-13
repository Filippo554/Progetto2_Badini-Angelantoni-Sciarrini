import {Component} from '@angular/core';

import { Page } from '../../../../shared/components/page/page';
import { HeaderComponent } from '../../../../shared/components/header/header';

@Component({
    selector: 'app-daily',
    templateUrl: './daily.html',
    // styleUrl: './daily.css',
    imports: [Page, HeaderComponent],
})
export class Daily {}