import { PizzaModule } from './pizza.module';

describe('PizzaModule', () => {
  let pizzaModule: PizzaModule;

  beforeEach(() => {
    pizzaModule = new PizzaModule();
  });

  it('should create an instance', () => {
    expect(pizzaModule).toBeTruthy();
  });
});
