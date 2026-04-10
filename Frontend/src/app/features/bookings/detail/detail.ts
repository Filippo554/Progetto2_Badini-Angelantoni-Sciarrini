import {Component} from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.html',
    styleUrl: './detail.css',
    imports: [HeaderComponent],
})
export class Detail {}