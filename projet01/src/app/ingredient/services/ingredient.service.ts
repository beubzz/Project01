import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpEvent } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Ingredient } from '../models/ingredient';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  private ingredientsUrl: string;

  constructor(private http: HttpClient) { 
    this.ingredientsUrl = `${environment.apiUrl}/ingredient`;
  }

  public getSearchedIngredients(term){
    return this.http.get<Array<Ingredient>>(`${this.ingredientsUrl}?q=${term}`);
    /*.pipe(map(res => {
        return res.map(item => {
            return item.name
        })
    }));*/
}

  public getIngredients(): Observable<Array<Ingredient>> {
    console.log(this.ingredientsUrl);
    return this.http.get<Array<Ingredient>>(this.ingredientsUrl);
  }

  public getIngredient(id: string): Observable<Ingredient> {
    const url = `${this.ingredientsUrl}/${id}`;
    return this.http.get<Ingredient>(url);
  }

  // CHANGER LE TYPE ANY POUR TOUT LES HTTPOPTIONS !!!
  public addIngredient(ingredient: any, httpOptions: any = null): Observable<Ingredient> {
    return this.http.post<Ingredient>(this.ingredientsUrl, ingredient);
  }

  public deleteIngredient(Ingredient: Ingredient | string, httpOptions: any = null): Observable<Ingredient> {
    const id = typeof Ingredient === 'string' ? Ingredient : Ingredient._id;
    const url = `${this.ingredientsUrl}/${id}`;

    return this.http.delete<Ingredient>(url, this.httpOptions);
  }

  public updateIngredient(ingredient: any, _id: string, httpOptions: any = null): Observable<any> {
    const url = `${this.ingredientsUrl}/${ingredient._id}`;
    
    return this.http.post(url, Ingredient);
  }

  public getImage(imageName: string): Observable<Blob> {
    const protectedUrl = `${this.ingredientsUrl}/img/${imageName}`;
    return this.http.get(protectedUrl, { responseType: 'blob' });
  }

  /* public updateIngredient(Ingredient: Ingredient, httpOptions: any = null): Observable<any> {
    return this.http.put(this.ingredientsUrl, Ingredient, this.httpOptions);
  }*/
}
