import { Component } from "@angular/core";
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-logo',
    templateUrl: './logo.html',
    styleUrl: './logo.css',
    imports: [NgOptimizedImage]
})
export class Logo {}