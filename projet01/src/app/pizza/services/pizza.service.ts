import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pizza } from '../models/pizza.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { ResponseContentType } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json', 
      'Accept': 'application/json',
    })
  };

  private pizzasUrl: string;

  constructor(private http: HttpClient) { 
    this.pizzasUrl = `${environment.apiUrl}/pizza`;
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
  public addPizza(pizza: any, httpOptions: any = null): Observable<any> {
    // console.log(pizza);
    return this.http.post(this.pizzasUrl, pizza);
  }

  public deletePizza(pizza: Pizza | string, httpOptions: any = null): Observable<Pizza> {
    const id = typeof pizza === 'string' ? pizza : pizza._id;
    const url = `${this.pizzasUrl}/${id}`;

    return this.http.delete<Pizza>(url, this.httpOptions);
  }

  public updatePizza(pizza: Pizza, httpOptions: any = null): Observable<any> {
    const url = `${this.pizzasUrl}/${pizza._id}`;
    
    return this.http.post(url, pizza, this.httpOptions);
  }

  public getImage(imageName: string): Observable<Blob> {
    const protectedUrl = `${this.pizzasUrl}/img/${imageName}`;
    return this.http.get(protectedUrl, { responseType: 'blob' });
  }

  /* public updateIngredient(Ingredient: Ingredient, httpOptions: any = null): Observable<any> {
    return this.http.put(this.ingredientsUrl, Ingredient, this.httpOptions);
  }
  public updatePizza(pizza: Pizza, httpOptions: any): Observable<any> {
    return this.http.put(this.pizzasUrl, pizza, httpOptions);
  }*/
}
