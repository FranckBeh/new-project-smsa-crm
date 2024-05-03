import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clients } from './clients.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:3000/clients';

  constructor(private http: HttpClient) {}

  getClients(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.apiUrl}`, { params });
  }


  searchClients(searchQuery: string, page: number, pageSize: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('searchQuery', searchQuery);
    params = params.append('page', page.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  getClientById(id: number): Observable<Clients> {
    return this.http.get<Clients>(`${this.apiUrl}/${id}`);
  }
  getClientCount(): Observable<Clients> {
    return this.http.get<Clients>(`${this.apiUrl}/count`);
  }

  createClient(Clients: Clients): Observable<Clients> {
    return this.http.post<Clients>(`${this.apiUrl}`, Clients);
  }

  updateClient(id: number, Clients: Clients): Observable<Clients> {
    return this.http.put<Clients>(`${this.apiUrl}/${id}`, Clients);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
