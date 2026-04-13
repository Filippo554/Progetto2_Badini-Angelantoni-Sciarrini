import {Component} from '@angular/core';

import { Page } from '../../../shared/components/page/page';
import { HeaderComponent } from '../../../shared/components/header/header';

@Component({
    selector: 'app-create',
    templateUrl: './create.html',
    // styleUrl: './create.css',
    imports: [Page, HeaderComponent],
})
export class Create {}