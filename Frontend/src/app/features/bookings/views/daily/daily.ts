import {Component} from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header';

@Component({
    selector: 'app-daily',
    templateUrl: './daily.html',
    styleUrl: './daily.css',
    imports: [HeaderComponent],
})
export class Daily {}