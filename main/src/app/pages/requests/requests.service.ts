import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
//import { environment } from 'src/environments/environment';
import { Note } from './requests.model';
import { environment } from 'src/app/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  //private apiUrl = environment.apiUrl + '/notes'; // Assurez-vous d'ajuster l'URL API selon votre configuration
private apiUrl = 'http://localhost:3000/notes';
private apiUrlPrest = 'http://localhost:3000/prestataires'; // URL de l'API
private apiUrlTag= 'http://localhost:3000/tags';
private apiUrlDomaines = 'http://localhost:3000/domaines';
private apiUrlVilles = 'http://localhost:3000/villes';
private apiUrlUser = 'http://localhost:3000/user';
private apiUrlProduct = 'http://localhost:3000/products';

  // private apiUrl = 'https://api.crm-smsa.com/notes'; // Assurez-vous d'ajuster l'URL API selon votre configuration

  private errorSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);


  constructor(private http: HttpClient) { }

  createNote(noteData: any): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}/create`, noteData);
  }

  getLastId(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/last-id`);
  }

  getList(page: number, limit: number): Observable<{ count: number, rows: Note[] }> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<{ count: number, rows: Note[] }>(`${this.apiUrl}/list`, { params });
  }

  getCurrentNotes(page: number, pageSize: number, searchQuery: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/current`, { params: { page, pageSize, search: searchQuery } });
  }

  getFinalizedNotes(page: number, pageSize: number, searchQuery: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/finalized`, { params: { page, pageSize, search: searchQuery } });
  }

  getCurrentNotesBy(filterData: any, page: number, limit: number): Observable<{ count: number, rows: Note[] }> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.post<{ count: number, rows: Note[] }>(`${this.apiUrl}/current/by`, filterData, { params });
  }

  getFinlizedNotesBy(filterData: any, page: number, limit: number): Observable<{ count: number, rows: Note[] }> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.post<{ count: number, rows: Note[] }>(`${this.apiUrl}/finalized/by`, filterData, { params });
  }

  updateNote(noteData: any): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/update`, noteData);
  }

  deleteNote(noteId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${noteId}`);
  }

  getNoteDetails(idNote: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${idNote}/details`);
  }

  getDomaines(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlDomaines}/`);
  }

  getPrestataires(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlPrest}/list`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlUser}/allUser`);
  }

  getVilles(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrlVilles}/`);
  }

  getProducts(): Observable<any>{
    return this.http.get<any[]>(`${this.apiUrlProduct}/getProducts`)
  }

  createRequest(formValue: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, formValue);
  }

}
