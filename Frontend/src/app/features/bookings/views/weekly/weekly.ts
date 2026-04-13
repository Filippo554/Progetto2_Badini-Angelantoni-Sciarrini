import {Component} from '@angular/core';

import { Page } from '../../../../shared/components/page/page';
import { HeaderComponent } from '../../../../shared/components/header/header';

@Component({
    selector: 'app-weekly',
    templateUrl: './weekly.html',
    // styleUrl: './weekly.css',
    imports: [Page, HeaderComponent],
})
export class Weekly {}