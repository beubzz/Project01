import { IngredientModule } from './ingredient.module';

describe('IngredientModule', () => {
  let ingredientModule: IngredientModule;

  beforeEach(() => {
    ingredientModule = new IngredientModule();
  });

  it('should create an instance', () => {
    expect(ingredientModule).toBeTruthy();
  });
});
