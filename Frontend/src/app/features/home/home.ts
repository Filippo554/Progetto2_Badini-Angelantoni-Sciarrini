import {Component} from '@angular/core';

import { Page } from '../../shared/components/page/page';
import { HeaderComponent } from '../../shared/components/header/header';

@Component({
    selector: 'app-home',
    templateUrl: './home.html',
    imports: [Page, HeaderComponent],
})
export class Home {}