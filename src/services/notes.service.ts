import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from "../app/models/user";
import {Observable} from "rxjs";
import { environment } from 'src/environments/environment';
import { Note } from 'src/app/models/Note';

export const NOTES_URL = environment.notesCCUrl;
@Injectable({
    providedIn: 'root'
  })
export class NoteService {
    url='/notesCC'
    constructor(
        private httpClient: HttpClient,
      ) { }

    addNote(data:any){
        console.log(NOTES_URL);
        return this.httpClient.post<Note>(<string>NOTES_URL,data);
    }

    getNote(idEtu:Number,idProf:Number){
        const url = `${NOTES_URL}/student/${idEtu}/professor/${idProf}`;
        return this.httpClient.get<Note>(<string>url);
    }

    updateNote(idEtu:Number,idProf:Number,data:any){
        const url = `${NOTES_URL}/${idEtu}/${idProf}`;
        return this.httpClient.patch<Note>(<string>url,data);
    }

}
