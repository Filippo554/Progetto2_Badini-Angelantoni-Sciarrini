import { Injectable } from "@angular/core";

interface User {
    id: number;
    nome: string;
    cognome: string;
    email: string;
    ruolo: string;
    attivo: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    is = false;
    id = 0;
    name = '';
    surname = '';
    email = '';
    role = '';
    isActive = false;

    init(user: User): void {
        this.id = user.id;
        this.name = user.nome;
        this.surname = user.cognome;
        this.email = user.email;
        this.role = user.ruolo;
        this.isActive = user.attivo;
        this.is = true;
    }

    clear(): void {
        this.is = false;
        this.id = 0;
        this.name = '';
        this.surname = '';
        this.email = '';
        this.role = '';
        this.isActive = false;
    }
}