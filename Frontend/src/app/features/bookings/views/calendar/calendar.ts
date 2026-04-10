import {Component} from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.html',
    styleUrl: './calendar.css',
    imports: [HeaderComponent],
})
export class Calendar {}