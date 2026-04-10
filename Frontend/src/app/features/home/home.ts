import {Component} from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header';

@Component({
    selector: 'app-home',
    templateUrl: './home.html',
    styleUrl: './home.css',
    imports: [HeaderComponent],
})
export class Home {}