import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Pizza } from '../../models/pizza.model';
import { PizzaService } from '../../services/pizza.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pizza-list',
  templateUrl: './pizza-list.component.html',
  styleUrls: ['./pizza-list.component.css']
})
export class PizzaListComponent implements OnInit {
  @ViewChild('imgSource') imgSource: ElementRef;

  public pizza: Pizza;
  public pizzas: Array<Pizza>;
  public selectedPizza: Array<Pizza>;
  public checkedPizza: Array<Pizza>;
  public isChecked: boolean;

  public modalRef: NgbModalRef;
  public modalPizza: Pizza;

  public images: Array<any>;

  // imageToShow: any;
  public isImageLoading: boolean;

  constructor(
    private pizzaService: PizzaService,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) {
    this.checkedPizza = new Array();
  }

  ngOnInit() {
    this.loadData();
    // console.log(this.pizzas);
  }

  /**
   * loadData
   *
   * Methode de chargement des données
   */
  public loadData() {
    this.pizzaService.getPizzas().subscribe(res => {
      this.pizzas = res;
      // console.log(this.pizzas);
    });
  }

  /**
   * onCheckboxChange
   *
   * @param element: HTMLInputElement
   * @param pizza: Pizza
   */
  public onCheckboxChange(
    element: HTMLInputElement,
    pizza: Pizza
  ) {
    if (typeof this.selectedPizza === 'undefined') {
      this.selectedPizza = [pizza];
    } else {
      const index = this.selectedPizza.indexOf(pizza);

      if (index === -1) {
        this.selectedPizza.push(pizza);
      } else {
        this.selectedPizza.splice(index, 1);
      }
    }

    if (element.checked) {
      if (
        this.checkedPizza.findIndex(x => x._id === pizza._id) === -1
      ) {
        this.checkedPizza.push(pizza);
      }
    } else {
      const index = this.checkedPizza.findIndex(
        x => x._id === pizza._id
      );
      if (index > -1) {
        this.checkedPizza.splice(index, 1);
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
      for (const pizza of this.pizzas) {
        const index = this.checkedPizza.findIndex(
          x => x._id === pizza._id
        );

        if (index === -1) {
          this.checkedPizza.push(pizza);
        }
      }
    } else {
      for (const pizza of this.pizzas) {
        const index = this.checkedPizza.findIndex(
          x => x._id === pizza._id
        );

        if (index > -1) {
          this.checkedPizza.splice(index, 1);
        }
      }

      this.selectedPizza = this.checkedPizza;
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

    if (this.pizzas.length <= this.checkedPizza.length) {
      for (const pizza of this.pizzas) {
        const index = this.checkedPizza.findIndex(
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
      this.checkedPizza &&
      this.checkedPizza.findIndex(x => x._id === pizza._id) > -1
    );
  }

  public activate(pizza: Pizza) {
    console.log('activate !');
  }

  public deactivate(pizza: Pizza) {
    console.log('desactivate !');
  }

  /**
   * Open a modal
   *
   * @param content template to open
   * @param size size the modal : lg or sm
   * @param pizza: Pizza
   */
  public open(content, size: string = 'lg', pizza: Pizza, fromDelete: boolean = false) {
    // console.log(this.imgSource.nativeElement);
    if (pizza) {
      this.images = new Array();
      if (!fromDelete) {
        this.getImageFromService(pizza);
      }
    }

    this.modalRef = this.modalService.open(content, {
      size: size === 'lg' ? 'lg' : 'sm',
    });
    this.modalPizza = pizza;
  }

  /**
   * close
   */
  public close(): void {
    this.modalRef.dismiss();
  }


  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      // this.imageToShow = reader.result;
      this.images.push(reader.result);
      // console.log(this.images);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getImageFromService(pizza: Pizza) {
    this.isImageLoading = true;
    for (let image of pizza.img) {
      // console.log(image);
      this.pizzaService.getImage(image).subscribe(data => {
        this.createImageFromBlob(data);
        
        setTimeout(res => (this.isImageLoading = false), 500);

        // this.isImageLoading = false;
      }, error => {
        this.isImageLoading = false;
        console.log(error);
      });
    }
  }



  public bulkPizzaDelete() {
    for (const pizza of this.checkedPizza) {
      this.delete(pizza._id);
    }
  }

  public delete(pizzaId: string) {
    // console.log(pizzaId);

    this.pizzaService.deletePizza(pizzaId).subscribe(
      data => {
        let mess =  'Pizza supprimé !';
        // console.log(data);

        // retour api avec {message, Pizza} (pour savoir si les images n'exister pas dans ./uploads/)
        if (data.message.indexOf('le(s)') !== -1) {
          mess = 'Pizza supprimé ! Mais image(s) non supprimée(s) car manquante(s)', 'Congrat';
        }
        this.toastr.success(mess, 'Congrat');
        // rechargement des données (donc sans l'element supprimé)
        this.loadData();
      },
      error => console.log(error) // Observable.throw(error)  
    );

    this.close();
  }
}
