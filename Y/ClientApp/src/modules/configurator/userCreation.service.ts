import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {   Observable } from 'rxjs';
import { UserCreation, UserCreationResponseDto } from './modal/userCreation.model';
@Injectable()
export class UserCreationService {
    constructor( private http: HttpClient) {
    }
    getAllUserCreations(): Observable<UserCreationResponseDto> {
        return  this.http.get<UserCreationResponseDto>('/api/GetAllUserCreation');
    }
    saveCreation(userCreation: UserCreation){
       return this.http.post('/api/SaveUserCreation', userCreation );
    }
    deleteUserCreation(userCreationId: number){
        return this.http.delete('/api/DeleteUserCreation/' + userCreationId);
    }
}
