import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-component-header',
    templateUrl: './header.html',
    styleUrl: './header.css',
    imports: [NgOptimizedImage],
})
export class HeaderComponent {}