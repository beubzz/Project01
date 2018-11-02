import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Pizza } from '../models/pizza.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  private pizzasUrl: string;

  constructor(private http: HttpClient) { 
    this.pizzasUrl = `${environment.apiUrl}`;
  }


  public getPizzas(): Observable<Array<Pizza>> {
    console.log(this.pizzasUrl);
    return this.http.get<Array<Pizza>>(this.pizzasUrl);
  }

  public getPizza(id: string): Observable<Pizza> {
    const url = `${this.pizzasUrl}/${id}`;
    return this.http.get<Pizza>(url);
  }

  // CHANGER LE TYPE ANY POUR TOUT LES HTTPOPTIONS !!!
  public addPizza(pizza: Pizza, httpOptions: any = null): Observable<Pizza> {
    console.log('sa passe !');
    return this.http.post<Pizza>(this.pizzasUrl, pizza, this.httpOptions);
  }

  public deletePizza(pizza: Pizza | string, httpOptions: any): Observable<HttpEvent<Pizza>> {
    const id = typeof pizza === 'string' ? pizza : pizza._id;
    const url = `${this.pizzasUrl}/${id}`;

    return this.http.delete<Pizza>(url, httpOptions);
  }

  public updatePizza(pizza: Pizza, httpOptions: any): Observable<any> {
    return this.http.put(this.pizzasUrl, pizza, httpOptions);
  }
}
