import { Component, OnInit } from '@angular/core';
import { PizzaService } from '../services/pizza.service';
import { Pizza } from '../models/pizza.model';

@Component({
  selector: 'app-pizza-form',
  templateUrl: './pizza-form.component.html',
  styleUrls: ['./pizza-form.component.css']
})
export class PizzaFormComponent implements OnInit {

  private pizza: Pizza;
  private pizzaService: PizzaService;

  constructor(pizzaService: PizzaService) { }

  ngOnInit() {

  }

}
