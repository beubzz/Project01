import { Component, OnInit } from '@angular/core';
import { Pizza } from '../models/pizza.model';
import { PizzaService } from '../services/pizza.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pizza-list',
  templateUrl: './pizza-list.component.html',
  styleUrls: ['./pizza-list.component.css']
})
export class PizzaListComponent implements OnInit {

  public pizza: Pizza;
  public pizzas: Array<Pizza>;
  // private pizzaService: PizzaService;

  constructor(private pizzaService: PizzaService) { }

  ngOnInit() {
    console.log('ici');

    this.pizza = new Pizza();
    this.pizza.name = 'test123';
    // this.pizza.img = '';
    this.pizza.description = 'description of pizza test123';
    this.pizza.lat = '43.5';
    this.pizza.long = '43.5';
    // this.pizza.ingredient = ['tomates', 'salade'];

    console.log(this.pizza);

    this.pizzaService.addPizza(this.pizza);

    this.pizzaService.getPizzas().subscribe(res => {
      this.pizzas = res;
    });
  }
}
