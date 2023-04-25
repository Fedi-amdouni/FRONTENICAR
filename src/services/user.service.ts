import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from "../app/models/user";
import {Observable} from "rxjs";
import { environment } from 'src/environments/environment';

export const USER_URL = environment.userUrl;
@Injectable({
    providedIn: 'root'
  })
export class UserService {
    url='/users'
    constructor(
        private httpClient: HttpClient,
      ) { }
    addUser(data:any){
        return this.httpClient.post<User>(<string>USER_URL,data);
    }

    getUserByMatiere(Matiere:any){
     
      const url = `${USER_URL}/matiere/${Matiere}`;
     
      return this.httpClient.get <User> (<string>url);

    }
    patchUser(data:any,id:number): Observable<User>
    {
      const url = `${USER_URL}/${id}`;
      return this.httpClient.patch<User>(url,data);
    }

    deleteUser(id:number){
      const url = `${USER_URL}/${id}`;
      return this.httpClient.delete<User>(url);
    }
}
