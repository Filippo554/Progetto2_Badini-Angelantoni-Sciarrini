import {Component} from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header';

@Component({
    selector: 'app-search',
    templateUrl: './search.html',
    styleUrl: './search.css',
    imports: [HeaderComponent],
})
export class Search {}