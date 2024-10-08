import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get(this.apiUrl);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  searchProducts(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search`, {
      params: { name }
    });
  }

  updateProduct(product: any): Observable<any> {
    // Make sure the product ID is part of the URL to update the specific product
    return this.http.put<any>(`${this.apiUrl}/${product.id}`, product);
  }
  deleteProduct(id: number): Observable<any> {
    console.log(`${this.apiUrl}/${id}`);

    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
