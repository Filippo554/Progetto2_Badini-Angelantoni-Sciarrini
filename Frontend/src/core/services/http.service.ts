import { Injectable } from "@angular/core";

import { BackendSession } from "./sessions.service";

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    getPrenotation(token: string): Promise<any[]> {
        return fetch("http://localhost:3000/api/v1/prenotazioni/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            return data.data ?? data;
        });
    }

    getClasses(token: string): Promise<any[]> {
        return fetch("http://localhost:3000/api/v1/classi/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            return data.data ?? data;
        });
    }
    getRooms(token: string): Promise<any[]> {
        return fetch("http://localhost:3000/api/v1/aule/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            return data.data ?? data;
        });
    }
    
    endpoint() {
        // PRENOTAZIONI
        // get
        fetch("http://localhost:3000/api/v1/prenotazioni/").then( res => res.json() ).then( data => data );
        fetch("http://localhost:3000/api/v1/prenotazioni/:id").then( res => res.json() ).then( data => data );
        // post
        fetch("http://localhost:3000/api/v1/prenotazioni/").then( res => res.json() ).then( data => data );
        // put
        fetch("http://localhost:3000/api/v1/prenotazioni/:id").then( res => res.json() ).then( data => data );
        // delete
        fetch("http://localhost:3000/api/v1/prenotazioni/:id").then( res => res.json() ).then( data => data );
    
        // CLASSI
        // get
        fetch("http://localhost:3000/api/v1/classi/").then( res => res.json() ).then( data => data );
        fetch("http://localhost:3000/api/v1/classi/:id").then( res => res.json() ).then( data => data );
        // post
        fetch("http://localhost:3000/api/v1/classi/").then( res => res.json() ).then( data => data );
        // put
        fetch("http://localhost:3000/api/v1/classi/:id").then( res => res.json() ).then( data => data );
        // delete
        fetch("http://localhost:3000/api/v1/classi/:id").then( res => res.json() ).then( data => data );
        
        // UTENTI
        // get
        fetch("http://localhost:3000/api/v1/utenti/").then( res => res.json() ).then( data => data );
        fetch("http://localhost:3000/api/v1/utenti/:id").then( res => res.json() ).then( data => data );
        // post
        fetch("http://localhost:3000/api/v1/utenti/").then( res => res.json() ).then( data => data );
        // put
        fetch("http://localhost:3000/api/v1/utenti/:id").then( res => res.json() ).then( data => data );
        // delete
        fetch("http://localhost:3000/api/v1/utenti/:id").then( res => res.json() ).then( data => data );
        
        // AULE
        // get
        fetch("http://localhost:3000/api/v1/aule/").then( res => res.json() ).then( data => data );
        fetch("http://localhost:3000/api/v1/aule/:id").then( res => res.json() ).then( data => data );
        // post
        fetch("http://localhost:3000/api/v1/aule/").then( res => res.json() ).then( data => data );
        // put
        fetch("http://localhost:3000/api/v1/aule/:id").then( res => res.json() ).then( data => data );
        // delete
        fetch("http://localhost:3000/api/v1/aule/:id").then( res => res.json() ).then( data => data );
    }
}