import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PizzaService } from '../../services/pizza.service';
import { Pizza } from '../../models/pizza.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable, Subject, concat, of } from 'rxjs';
import { Ingredient } from 'src/app/ingredient/models/ingredient';
import { IngredientService } from 'src/app/ingredient/services/ingredient.service';
import { distinctUntilChanged, debounceTime, tap, switchMap, catchError } from 'rxjs/operators';

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
  public filesToUpload: Array<File>;
  
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private pizzaService: PizzaService,
    private ingredientService: IngredientService
  ) {
    // init de nos variables globales
    this.submitted = false;
    this.pizza = new Pizza();
    this.ingredientsInput$ = new Subject<string>();
    this.ingredientArray = new Array();
    this.editMode = false;
  }

  ngOnInit() {
    // init et creation de notre reactiveForm
    this.pizzaForm = this.formBuilder.group({
      name: ['', Validators.required],
      img: ['', Validators.required],
      description: ['', Validators.required],
      lat: ['', Validators.required],
      long: ['', Validators.required],
      ingredients: ['', Validators.required]
    });

    // init de notre term : ce qui sera tapé sur le clavier (autocomplete)
    this.term = '';

    // Si notre route contient le term edit
    if (this.router.url.includes("edit")) {
      // Alors nous sommes en mode éditions
      this.editMode = true;
    }

    // Init de notre observable<Array<Ingredient>>
    this.ingredients$ = concat(
      of(new Array<Ingredient>()),
      this.ingredientsInput$.pipe(
        // retry toutes les 500 ms
        debounceTime(500),
        // sauf si sa change pas
        distinctUntilChanged(),
        tap(
          term => (
            // init de notre term (autocomplete)
            (this.term = term),
            // recherche en fonction de ce que nous avons tapé sur le clavier (term)
            this.ingredientService.getSearchedIngredients(this.term)
          ),
          // init de notre variable de chargement à true
          () => (this.isLoading = true)
        ),
        // gestion des errros ?
        switchMap(() =>
          (this.ingredientService.getSearchedIngredients(this.term)).pipe(
            catchError(() => of(new Array<Ingredient>())), // on vide la liste en mode error
            tap(() => (this.isLoading = false))
          )
        )
      )
    );

    // si on est en mode edition :
    if (this.editMode) {
      // récupération de l'id de la pizza via l'url
      const _id = this.router.url.split('/')[3];

      // Appel a notre pizzaService pour récuperation de la pizzaId passé en parametre
      this.pizzaService.getPizza(_id).subscribe(res => {
        // attribution du resultat a notre objet pizza
        this.pizza = res;
        // remplissage du formulaire via notre nouvelle objet pizza
        this.pizzaForm.controls.name.setValue(this.pizza.name);
        this.pizzaForm.controls.img.setValue(this.pizza.img);
        this.pizzaForm.controls.description.setValue(this.pizza.description);
        this.pizzaForm.controls.lat.setValue(this.pizza.lat);
        this.pizzaForm.controls.long.setValue(this.pizza.long);
        this.pizzaForm.controls.ingredients.setValue(this.pizza.ingredients);
      })
    }
  }

  /**
   *Fonction pour acces facile au form fields
   */
  public get f() {
    return this.pizzaForm.controls;
  }

  /**
   * Fonction de récupération de l'output de l'enfant :
   * - uploadFile (external - shared components)
   * @param files: Array<File>
   */
  public getAddedFiles(files: Array<File>) {
    // creation de notre array de nom d'image
    const imgArray = new Array();

    // pour chaque images on garde son nom dans notre imgArray
    for (const file of files) {
      imgArray.push(file.name);
    }

    // On set la valeur de notre champ images de notre formulaire par la liste des nom d'images
    this.pizzaForm.controls.img.setValue(imgArray);
    // On set notre variable gloable a notre Array<File>
    this.filesToUpload = files;
  }

  /**
   * Fonction de soumission de formulaire
   */
  public onSubmit() {
    this.submitted = true;

    // Verification de la validité de notre formulaire
    if (this.pizzaForm.invalid) {
      // Si invalide on previens l'utilisateur avec un toast
      this.toastr.error('Le formulaire n\' a pas été rempli correctement', 'error');
      return;
    } else {
      // si le formulaire est valide : on set notre objet au valeur du form
      this.pizza.name = this.pizzaForm.value.name;
      this.pizza.img = this.pizzaForm.value.img;
      this.pizza.description = this.pizzaForm.value.description;
      this.pizza.lat = this.pizzaForm.value.lat;
      this.pizza.long = this.pizzaForm.value.long;
      this.pizza.ingredients = this.pizzaForm.value.ingredients;
      // mongo remplie ce champs tout seul et automatiquement (updatedAt aussi)
      this.pizza.createdAt = '';

      // creation de notre formData pour le uploadFIle
      const formData = new FormData();

      // pour chaque images
      for (let img of this.filesToUpload) {
        // on créé un champs dans notre formulaire avec son nom et le fichier
        formData.append(img.name, img, img.name);
      }

      // puis on ajoute au champs content l'objet de notre pizza
      formData.append('content', JSON.stringify(this.pizza));

      // update si mode edition sinon add pizza
      if (this.editMode) {

        this.pizzaService.updatePizza(formData, this.pizza._id)
        .subscribe(
          data  => { 
            // console.log(data);
            this.toastr.success(`Pizza : ${data.name} modifié !`, 'Congrat');
            this.router.navigate(['pizza']);
          },
          error => console.log(error) // Observable.throw(error)  
        );
      } else {

        /*
        // creation de notre formData pour le uploadFIle
        const formData = new FormData();

        // pour chaque images
        for (let img of this.filesToUpload) {
          // on créé un champs dans notre formulaire avec son nom et le fichier
          formData.append(img.name, img, img.name);
        }

        // puis on ajoute au champs content l'objet de notre pizza
        formData.append('content', JSON.stringify(this.pizza));
        */

        // envoie du form complet a notre pizzaService
        this.pizzaService.addPizza(formData)
        .subscribe(
          data  => {
            // data = pizza Added
            // console.log(data);
            this.toastr.success('Pizza ajouté !', 'Congrat');
            this.router.navigate(['pizza']);
          },
          error => console.log(error)
        );
      }
    }
  }
}
