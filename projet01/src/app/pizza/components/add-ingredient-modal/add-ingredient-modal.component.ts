import { Component, OnInit } from '@angular/core';
import { Ingredient } from 'src/app/ingredient/models/ingredient';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IngredientFormComponent } from 'src/app/ingredient/ingredient-form/ingredient-form.component';

@Component({
  selector: 'app-add-ingredient-modal',
  templateUrl: './add-ingredient-modal.component.html',
  styleUrls: ['./add-ingredient-modal.component.css']
})
export class AddIngredientModalComponent implements OnInit {

  public modalIngredient: Ingredient;
  public modalRef: NgbModalRef;
  public modalLoader: string;

  public clicked: boolean;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.clicked = false;
  }

  /**
   * Open a modal
   *
   * @param content template to open
   * @param size size the modal : lg or sm
   * @param message message
   */
  public open(content, size: string = 'lg') {
    this.modalRef = this.modalService.open(content, {
      size: size === 'lg' ? 'lg' : 'sm',
    });
  }

  /**
   * close
   */
  public close(): void {
    this.modalRef.dismiss();
  }

}
