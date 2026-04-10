import {Component} from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header';

@Component({
    selector: 'app-weekly',
    templateUrl: './weekly.html',
    styleUrl: './weekly.css',
    imports: [HeaderComponent],
})
export class Weekly {}