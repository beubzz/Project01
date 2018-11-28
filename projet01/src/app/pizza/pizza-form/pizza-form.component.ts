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
import { UploadFile, UploadEvent, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { HttpErrorResponse } from '@angular/common/http';
import { UploadService } from 'src/app/shared/components/file-upload/file-upload.service';

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
  public editMode: boolean;
  public fileToUpload: File;
  
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private pizzaService: PizzaService,
    private ingredientService: IngredientService,
    private uploadFileService: UploadService
  ) {
    this.submitted = false;
    this.pizza = new Pizza();
    this.ingredientsInput$ = new Subject<string>();
    this.ingredientArray = new Array();
    this.editMode = false;
  }

  ngOnInit() {
    this.pizzaForm = this.formBuilder.group({
      name: ['', Validators.required],
      img: ['', ], // Validators.required],
      description: ['', Validators.required],
      lat: ['', Validators.required],
      long: ['', Validators.required],
      ingredients: ['', Validators.required]
    });

    this.term = '';

    if (this.router.url.includes("edit")) {
      this.editMode = true;
    }

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

    if (this.editMode) {
      const _id = this.router.url.split('/')[3];
      // console.log(_id);

      this.pizzaService.getPizza(_id).subscribe(res => {
        this.pizza = res;
        this.pizzaForm.controls.name.setValue(this.pizza.name);
        this.pizzaForm.controls.img.setValue(this.pizza.img);
        this.pizzaForm.controls.description.setValue(this.pizza.description);
        this.pizzaForm.controls.lat.setValue(this.pizza.lat);
        this.pizzaForm.controls.long.setValue(this.pizza.long);
        this.pizzaForm.controls.ingredients.setValue(this.pizza.ingredients);
      })
    }

  }

  // convenience getter for easy access to form fields
  public get f() {
    return this.pizzaForm.controls;
  }

  onSubmit() {
      this.submitted = true;
      console.log(this.pizzaForm);

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
        
        // console.log(this.pizzaForm.value.ingredients);

        this.pizza.ingredients = this.pizzaForm.value.ingredients;

        // console.log(this.pizzaForm.value.ingredients);
        // console.log(this.ingredientArray);
        // this.pizza.ingredients = this.ingredientArray ? this.ingredientArray : [];
        this.pizza.createdAt = '';
        // console.log('ici', this.pizza);

        if (this.editMode) {
          this.pizzaService.updatePizza(this.pizza)
          .subscribe(
            data  => { 
              // console.log(data);
              this.toastr.success(`Pizza : ${data.name} modifié !`, 'Congrat');
              this.router.navigate(['pizza']);
            },
            error => console.log(error) // Observable.throw(error)  
          );
        } else {
          this.pizzaService.addPizza(this.pizza)
          .subscribe(
            data  => { 
              this.uploadFile(this.fileToUpload);

              console.log(' ca paaaaaasssse !');
              this.uploadFileService.upload(this.fileToUpload);

              
              // console.log(data);
              this.toastr.success('Pizza ajouté !', 'Congrat');
              this.router.navigate(['pizza']);
            },
            error => console.log(error) // Observable.throw(error)  
          );
        }

      }
  }

  //cpublic files: UploadFile[] = [];
 
  public dropped(event: UploadEvent) {
    // this.fileToUpload2 = event.files;

    // Verification du fichier uploader (Cas fichier)
    if (event.files.length === 1) {
    // Verification que ce soit bien un fichier (un dossier zip est interprété comme un fichier)
    if (event.files[0].fileEntry.isFile) {
    const fileEntry = event.files[0].fileEntry as FileSystemFileEntry;
    fileEntry.file((file: File) => {
    // this.importForm.controls.fichierExisting.setValue(false);
    this.fileToUpload = file;
    // this.onFileChange(file);
    });
    } else {
    this.toastr.error('Ceci n\'est pas un fichier', 'Erreur');
    }
    } else {
    // Verification du fichier uploader (Cas dossier donc plusieurs fichiers)
    this.toastr.error('Ceci n\'est pas un fichier', 'Erreur');
    }
  }
 
  public fileOver(event){
    console.log(event);
  }
 
  public fileLeave(event){
    console.log(event);
  }

   /**
 * uploadFile
 *
 * Permet d'envoyer en POST notre formulaire
 */
  private uploadFile(file) {
    // let test = this.pizzaService.upload(file);
    console.log(file);
    // test.subscribe();
  }

}
