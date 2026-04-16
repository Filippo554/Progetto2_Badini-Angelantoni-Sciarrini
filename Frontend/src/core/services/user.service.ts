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
    is: boolean = false;
    id!: number;
    name!: string;
    surname!: string;
    email!: string;
    role!: string;
    isActive!: boolean;

    init(user: User) {
        this.id = user.id;
        this.name = user.nome;
        this.surname = user.cognome;
        this.email = user.email;
        this.role = user.ruolo;
        this.isActive = user.attivo;
    }
}