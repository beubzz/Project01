import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Ingredient } from '../models/ingredient';
import { IngredientService } from '../services/ingredient.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.css']
})
export class IngredientFormComponent implements OnInit {

  @Input() isFromModal: boolean;
  @Input() modalRef: NgbModalRef;

  public ingredientForm: FormGroup;
  public submitted: boolean;
  
  public ingredient: Ingredient;
  public editMode: boolean;
  
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private ingredientService: IngredientService
  ) {
    this.submitted = false;
    this.ingredient = new Ingredient();
    this.editMode = false;
  }

  ngOnInit() {
    this.ingredientForm = this.formBuilder.group({
      name: ['', Validators.required],
      img: ['', Validators.required],
      description: ['', Validators.required],
      weight: ['', [Validators.pattern("^[0-9]*$") , Validators.required]],
      price: ['', [Validators.pattern("^[0-9]*$") , Validators.required]]
    });

    this.editMode = this.router.url.includes('edit');

    if (this.editMode) {
      const _id = this.router.url.split('/')[3];
      // console.log(_id);
      
      this.ingredientService.getIngredient(_id).subscribe(res => {
        this.ingredient = res;
        const weight = this.ingredient.weight.replace(',', '.');
        const price = this.ingredient.price.replace(',', '.');
        this.ingredientForm.controls.name.setValue(this.ingredient.name);
        this.ingredientForm.controls.img.setValue(this.ingredient.img);
        this.ingredientForm.controls.description.setValue(this.ingredient.description);
        this.ingredientForm.controls.weight.setValue(weight);
        this.ingredientForm.controls.price.setValue(price);
      })
    }
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
        console.log(this.ingredient);
        console.log(this.ingredientForm);
        this.ingredient.name = this.ingredientForm.value.name;
        this.ingredient.img = this.ingredientForm.value.img;
        this.ingredient.description = this.ingredientForm.value.description;
        this.ingredient.weight = this.ingredientForm.value.weight;
        this.ingredient.price = this.ingredientForm.value.price;
        this.ingredient.deleted = false;
        this.ingredient.createdAt = '';

        if (this.editMode) {
          this.ingredientService.updateIngredient(this.ingredient)
          .subscribe(
            data  => { 
              // console.log(data);
              this.toastr.success('Ingrédient ajouté !', 'Congrat');
              if (this.isFromModal) {
                this.modalRef.close();
              } else {
                this.router.navigate(['ingredient']);
              }
            }
          );
        } else {
          this.ingredientService.addIngredient(this.ingredient)
          .subscribe(
            data  => { 
              // console.log(data);
              this.toastr.success('Ingrédient ajouté !', 'Congrat');
              if (this.isFromModal) {
                this.modalRef.close();
              } else {
                this.router.navigate(['ingredient']);
              }
            }
          );
        }

      }
  }
}
