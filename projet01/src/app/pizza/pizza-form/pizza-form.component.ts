import { Component, OnInit, ViewChild } from '@angular/core';
import { PizzaService } from '../services/pizza.service';
import { Pizza } from '../models/pizza.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable, Subject, merge, concat, of } from 'rxjs';
import { Ingredient } from 'src/app/ingredient/models/ingredient';
import { IngredientService } from 'src/app/ingredient/services/ingredient.service';
import { map, distinctUntilChanged, debounceTime, startWith, delay, filter, tap, switchMap, catchError } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pizza-form',
  templateUrl: './pizza-form.component.html',
  styleUrls: ['./pizza-form.component.css']
})
export class PizzaFormComponent implements OnInit {

  public pizzaForm: FormGroup;
  public submitted: boolean = false;
  public pizza: Pizza;

  public ingredients$: Observable<Array<Ingredient>>;
  public ingredientsInput$: Subject<string>;

  public term: string;
  public isLoading: boolean;
  public ingredientArray: Array<Ingredient>;
  
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private pizzaService: PizzaService,
    private ingredientService: IngredientService
  ) {
    this.submitted = false;
    this.pizza = new Pizza();
    this.ingredientsInput$ = new Subject<string>();
    this.ingredientArray = new Array();
  }

  ngOnInit() {
    this.pizzaForm = this.formBuilder.group({
      name: ['', Validators.required],
      img: ['', Validators.required],
      description: ['', Validators.required],
      lat: ['', Validators.required],
      long: ['', Validators.required],
      ingredients: ['', Validators.required]
    });

    this.term = '';

    this.ingredients$ = concat(
      of(new Array<Ingredient>()),
      this.ingredientsInput$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(
          term => (
            (this.term = term),
            this.ingredientService.getSearchedIngredients(this.term)
          ),
          () => (this.isLoading = true)
        ),
        switchMap(() =>
          (this.ingredientService.getSearchedIngredients(this.term)).pipe(
            catchError(() => of(new Array<Ingredient>())), // on vide la liste en mode error
            tap(() => (this.isLoading = false))
          )
        )
      )
    );

  }

  // convenience getter for easy access to form fields
  public get f() {
    return this.pizzaForm.controls;
  }

  onSubmit() {
      this.submitted = true;

      // console.log(this.pizzaForm);

      // stop here if form is invalid
      if (this.pizzaForm.invalid) {
        this.toastr.error('Le formulaire n\' a pas été rempli correctement', 'error');
        return;
      } else {
        this.pizza.name = this.pizzaForm.value.name;
        this.pizza.img = this.pizzaForm.value.img;
        this.pizza.description = this.pizzaForm.value.description;
        this.pizza.lat = this.pizzaForm.value.lat;
        this.pizza.long = this.pizzaForm.value.long;
        
        console.log(this.pizzaForm.value.ingredients);

        // met en place uniquement les object id ...
        this.pizza.ingredients = this.pizzaForm.value.ingredients;

        // console.log(this.pizzaForm.value.ingredients);
        // console.log(this.ingredientArray);
        // this.pizza.ingredients = this.ingredientArray ? this.ingredientArray : [];
        this.pizza.createdAt = '';
        console.log('ici', this.pizza);

        this.pizzaService.addPizza(this.pizza)
        .subscribe(
          data  => { 
            console.log(data);
            this.toastr.success('Pizza ajouté !', 'Congrat');
            this.router.navigate(['pizza']);
          },
          error => Observable.throw(error)  
        );

      }
  }
}
