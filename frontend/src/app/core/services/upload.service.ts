import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private http = inject(HttpClient);

  uploadPhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file);

    return this.http.post('http://localhost:5000/upload', formData);
  }
}