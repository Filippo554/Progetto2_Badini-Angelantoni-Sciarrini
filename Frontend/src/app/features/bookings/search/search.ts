import {Component} from '@angular/core';

import { Page } from '../../../shared/components/page/page';
import { HeaderComponent } from '../../../shared/components/header/header';

@Component({
    selector: 'app-search',
    templateUrl: './search.html',
    // styleUrl: './search.css',
    imports: [Page, HeaderComponent],
})
export class Search {}