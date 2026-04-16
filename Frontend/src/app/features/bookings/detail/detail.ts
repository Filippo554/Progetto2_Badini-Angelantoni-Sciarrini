import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Page } from '../../../shared/components/page/page';
import { HttpService } from '../../../../core/services/http.service';
import { BackendSession } from '../../../../core/services/sessions.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.html',
    styleUrl: './detail.css',
    imports: [Page],
})
export class Detail {
    httpService = inject(HttpService);
    route = inject(ActivatedRoute);
    backendSession = inject(BackendSession);
    
    prenotation: any = null;
    errorMessage = '';

    async ngOnInit() {
        const token = this.backendSession.sessionToken;
        const id = Number(this.route.snapshot.queryParamMap.get('id'));

        if (!token || !id) {
            this.errorMessage = 'Dettaglio non disponibile.';
            return;
        }

        try {
            const data = await this.httpService.getPrenotationById(token, id);

            this.prenotation = {
                classes: (data.classi ?? []).map((c: any, index: number) => ({
                    id: index,
                    c: c.nome
                })),
                room: data.aula?.numero ?? '',
                date: data.data ?? '',
                start: String(data.ora_inizio ?? '').slice(0, 5),
                end: String(data.ora_fine ?? '').slice(0, 5),
                teacher: data.utente
                    ? `${data.utente.cognome} ${data.utente.nome}`
                    : 'N/D'
            };
        } catch (error) {
            console.error(error);
            this.errorMessage = 'Errore caricamento dettaglio.';
        }
    }
}