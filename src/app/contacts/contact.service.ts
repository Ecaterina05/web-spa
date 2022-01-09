import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
 
import { Contact } from './contact.model'

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  getList(): Observable<Contact[]> {
    console.log("Getting all contacts from the server");
    return this.http.get<Contact[]>('http://localhost:4201/contacts');
  }

  getContact(id: string): Observable<Contact> {
    console.log("Getting a specific contact from the server");
    return  this.http.get<Contact>(`http://localhost:4201/contacts/${id}`);
  }
  
  createContact(newContact: Contact): Observable<Contact> {
    return this.http.post<Contact>('http://localhost:4201/contacts', newContact);
  }

  updateContact(updatedContact: Contact): Observable<void> {
    return this.http.put<void>(`http://localhost:4201/contacts/${updatedContact.contactId}`, updatedContact);
  }

  deleteContact(contactId: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:4201/contacts/${contactId}`);
  }

}