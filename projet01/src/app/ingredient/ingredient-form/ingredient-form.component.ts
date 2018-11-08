import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Ingredient } from '../models/ingredient';
import { IngredientService } from '../services/ingredient.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.css']
})
export class IngredientFormComponent implements OnInit {

  public ingredientForm: FormGroup;
  public submitted: boolean = false;

  public ingredient: Ingredient;
  
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private ingredientService: IngredientService
  ) {
    this.submitted = false;
    this.ingredient = new Ingredient();
  }

  ngOnInit() {
    this.ingredientForm = this.formBuilder.group({
      name: ['', Validators.required],
      img: ['', Validators.required],
      description: ['', Validators.required],
      weight: ['', [Validators.pattern("^[0-9]*$") , Validators.required]],
      price: ['', [Validators.pattern("^[0-9]*$") , Validators.required]]
    });
  }

  // convenience getter for easy access to form fields
  public get f() {
    return this.ingredientForm.controls;
  }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.ingredientForm.invalid) {
        this.toastr.error('Le formulaire n\' a pas été rempli correctement', 'error');
        return;
      } else {
        this.ingredient.name = this.ingredientForm.value.name;
        this.ingredient.img = this.ingredientForm.value.img;
        this.ingredient.description = this.ingredientForm.value.description;
        this.ingredient.weight = this.ingredientForm.value.weight;
        this.ingredient.price = this.ingredientForm.value.price;
        this.ingredient.deleted = false;
        this.ingredient.createdAt = '';

        this.ingredientService.addIngredient(this.ingredient)
        .subscribe(
          data  => { 
            console.log(data);
            this.toastr.success('Ingrédient ajouté !', 'Congrat');
            this.router.navigate(['ingredient']);
          },
          error => Observable.throw(error)  
        );

      }
  }
}
