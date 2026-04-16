import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';

import { Page } from '../../../shared/components/page/page';
import { HttpService } from '../../../../core/services/http.service';
import { BackendSession } from '../../../../core/services/sessions.service';

@Component({
    selector: 'app-book',
    templateUrl: './book.html',
    styleUrl: './book.css',
    imports: [ReactiveFormsModule, FormsModule, Page],
})
export class Book {
    httpService = inject(HttpService);
    backendSession = inject(BackendSession);
    
    classes: { id: number; c: string }[] = [];
    rooms: { id: number; n: number }[] = [];
    errorMessage = '';
    successMessage = '';

    prenotationForm = new FormGroup({
        classes: new FormControl<number[]>([], {
            nonNullable: true,
            validators: [(control) => control.value.length > 0 ? null : { required: true }]
        }),
        room: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        date: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        from: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        to: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
    });

    search = '';

    async ngOnInit() {
        const token = this.backendSession.sessionToken;
        if (!token) return;

        try {
            const [classes, rooms] = await Promise.all([
                this.httpService.getClasses(token),
                this.httpService.getRooms(token)
            ]);

            this.classes = classes.map((c: any) => ({
                id: c.id,
                c: c.nome
            }));

            this.rooms = rooms.map((r: any) => ({
                id: r.id,
                n: r.numero
            }));
        } catch (error) {
            console.error(error);
            this.errorMessage = 'Errore caricamento dati.';
        }
    }

    async handleSubmit() {
        const token = this.backendSession.sessionToken;
        if (!token || !this.prenotationForm.valid) return;

        this.errorMessage = '';
        this.successMessage = '';

        try {
            await this.httpService.createPrenotation(token, {
                aulaId: Number(this.prenotationForm.value.room),
                data: this.prenotationForm.value.date,
                oraInizio: this.prenotationForm.value.from,
                oraFine: this.prenotationForm.value.to,
                classi: this.prenotationForm.value.classes,
                note: null
            });

            this.successMessage = 'Prenotazione creata con successo.';
            this.prenotationForm.reset({
                classes: [],
                room: '',
                date: '',
                from: '',
                to: ''
            });
        } catch (error: any) {
            console.error(error);
            this.errorMessage = error.message || 'Errore creazione prenotazione.';
        }
    }

    get filteredClasses() {
        return this.classes.filter(c =>
            c.c.toLowerCase().includes(this.search.toLowerCase())
        );
    }

    isSelected(id: number): boolean {
        return this.prenotationForm.get('classes')?.value.includes(id) ?? false;
    }

    toggleClass(id: number) {
        const selected = this.prenotationForm.get('classes')?.value ?? [];
        const updated: number[] = selected.includes(id)
            ? selected.filter(s => s !== id)
            : [...selected, id];
        this.prenotationForm.get('classes')?.setValue(updated);
    }
}