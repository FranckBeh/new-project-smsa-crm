import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { Clients, Conjoint, Enfant } from './clients.model';
import { TypeClient } from '../type-client/type-client.model';
import { Societe } from '../societe/societe.model';
import { environment } from 'src/app/environment/environment';

export interface ClientPayload {
  clientData: Clients;
  conjointData?: Conjoint;
  enfantsData?: Enfant[];
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:3000/clients' || 'https://api.crm-smsa.com/clients';
  private apiUrlTypeclient = 'http://localhost:3000/typeClient' || 'https://api.crm-smsa.com/typeClient';
  private apiUrlSociete = environment.apiUrl + 'societes' || 'https://api.crm-smsa.com/societes';

 // private apiUrl = 'https://api.crm-smsa.com/clients';
 // private apiUrlTypeclient = 'https://api.crm-smsa.com/typeClient';
 // private apiUrlSociete =  'https://api.crm-smsa.com/societes';

  private typeclientSubject: BehaviorSubject<TypeClient[]> = new BehaviorSubject<TypeClient[]>([]);
  public typeclient$: Observable<TypeClient[]> = this.typeclientSubject.asObservable();

  private societesSubject: BehaviorSubject<Societe[]> = new BehaviorSubject<Societe[]>([]);
  public societes$: Observable<Societe[]> = this.societesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getClients(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.apiUrl}`, { params });
  }
  getAllClients(): Observable<Clients[]> {
    return this.http.get<Clients[]>(`${this.apiUrl}/AllClients`);
  }

  loadTypeClient(): Observable<TypeClient[]> {
    return this.http.get<TypeClient[]>(this.apiUrlTypeclient).pipe(
      tap((typeclients: TypeClient[]) => this.typeclientSubject.next(typeclients)),
      catchError(this.handleError)
    );
  }

  getAllSocietes(): Observable<Societe[]> {
    return this.http.get<Societe[]>(this.apiUrlSociete).pipe(
      tap((societes: Societe[]) => this.societesSubject.next(societes)),
      catchError(this.handleError)
    );
  }

  searchSocietes(term: string): Observable<Societe[]> {
    return this.http.get<Societe[]>(`${this.apiUrlSociete}?term=${term}`).pipe(
      catchError(this.handleError)
    );
  }

  searchClients(searchQuery: string, page: number, pageSize: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('searchQuery', searchQuery);
    params = params.append('page', page.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  getClientCount(): Observable<Clients> {
    return this.http.get<Clients>(`${this.apiUrl}/count`);
  }

  createClient(payload: ClientPayload): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, payload);
  }

  updateClient(clientId: number, payload: ClientPayload): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${clientId}`, payload);
  }

  deleteClient(clientId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${clientId}`);
  }

  getClientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  checkLoginAvailability(login: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.apiUrl}/checkLogin/${login}`).pipe(
      catchError(error => {
        console.error('API error:', error);
        return of({ available: false });  // Retourner un objet par défaut en cas d'erreur
      })
    );
  }

  handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
