// entreprise.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
  private apiUrl = 'http://localhost:3000/companies';

  constructor(private http: HttpClient) { }

  getEntreprises(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`); // Endpoint pour récupérer les entreprises
  }

  createEntreprise(entrepriseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, entrepriseData);
  }
}
