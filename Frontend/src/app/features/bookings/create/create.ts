import {Component} from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header';

@Component({
    selector: 'app-create',
    templateUrl: './create.html',
    styleUrl: './create.css',
    imports: [HeaderComponent],
})
export class Create {}