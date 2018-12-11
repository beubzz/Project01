import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../services/ingredient.service';
import { Ingredient } from '../models/ingredient';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.css']
})
export class IngredientListComponent implements OnInit {

  public ingredient: Ingredient;
  public ingredients: Array<Ingredient>;
  public selectedIngredient: Array<Ingredient>;
  public checkedIngredient: Array<Ingredient>;
  public isChecked: boolean;

  public modalRef: NgbModalRef;
  public modalIngredient: Ingredient;


  constructor(
    private ingredientService: IngredientService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.checkedIngredient = new Array();
  }

  ngOnInit() {
    this.loadData();
  }

  public loadData() {
    this.ingredientService.getIngredients().subscribe(res => {
      this.ingredients = res;
    })
  }

  /**
   * onCheckboxChange
   *
   * @param element: HTMLInputElement
   * @param ingredient: Ingredient
   */
  public onCheckboxChange(
    element: HTMLInputElement,
    ingredient: Ingredient
  ) {
    if (typeof this.selectedIngredient === 'undefined') {
      this.selectedIngredient = [ingredient];
    } else {
      const index = this.selectedIngredient.indexOf(ingredient);

      if (index === -1) {
        this.selectedIngredient.push(ingredient);
      } else {
        this.selectedIngredient.splice(index, 1);
      }
    }

    if (element.checked) {
      if (
        this.checkedIngredient.findIndex(x => x._id === ingredient._id) === -1
      ) {
        this.checkedIngredient.push(ingredient);
      }
    } else {
      const index = this.checkedIngredient.findIndex(
        x => x._id === ingredient._id
      );
      if (index > -1) {
        this.checkedIngredient.splice(index, 1);
      } else {
        this.isChecked = false;
      }
    }
  }

  /**
   * checkAll
   *
   * Permet de checker tous les elements affichés.
   */
  public checkAll() {
    if (this.isChecked === true) {
      this.isChecked = false;
    } else {
      this.isChecked = true;
    }

    if (this.isChecked === true) {
      for (const ingredient of this.ingredients) {
        const index = this.checkedIngredient.findIndex(
          x => x._id === ingredient._id
        );

        if (index === -1) {
          this.checkedIngredient.push(ingredient);
        }
      }
    } else {
      for (const ingredient of this.ingredients) {
        const index = this.checkedIngredient.findIndex(
          x => x._id === ingredient._id
        );

        if (index > -1) {
          this.checkedIngredient.splice(index, 1);
        }
      }

      this.selectedIngredient = this.checkedIngredient;
    }
  }

  /**
   * tryToCheck
   *
   * Permet de comparé la liste des elements en fonction des elements séléctionnés.
   * Permet donc de garder les elements selectionné meme si on change de filtre / page etc
   *
   * @param pizza: Pizza
   */
  public tryToCheck(pizza) {

    if (this.ingredients.length <= this.checkedIngredient.length) {
      for (const ingredient of this.ingredients) {
        const index = this.checkedIngredient.findIndex(
          x => x._id === pizza._id
        );
        if (index !== -1) {
          this.isChecked = true;
        } else {
          this.isChecked = false;
          break;
        }
      }
    } else {
      this.isChecked = false;
    }

    return (
      this.checkedIngredient &&
      this.checkedIngredient.findIndex(x => x._id === pizza._id) > -1
    );
  }

  public activate(ingredient: Ingredient) {
    console.log('activate !');
  }

  public deactivate(ingredient: Ingredient) {
    console.log('desactivate !');
  }

  /**
   * Open a modal
   *
   * @param content template to open
   * @param size size the modal : lg or sm
   * @param ingredient: Ingredient
   */
  public open(content, size: string = 'lg', ingredient: Ingredient) {
    this.modalRef = this.modalService.open(content, {
      size: size === 'lg' ? 'lg' : 'sm',
    });
    this.modalIngredient = ingredient;
  }

  /**
   * close
   */
  public close(): void {
    this.modalRef.dismiss();
  }

  public delete(ingredientId: string) {
    // console.log(ingredientId);

    this.ingredientService.deleteIngredient(ingredientId).subscribe(
      data  => {
        // console.log(data);
        this.toastr.success('Ingredient supprimé !', 'Congrat');
        // rechargement des données (donc sans l'element supprimé)
        this.loadData();
      },
      error => console.log(error) // Observable.throw(error)  
    );

    this.close();
  }
}
