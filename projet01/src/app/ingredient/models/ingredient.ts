export class Ingredient {
  toLowerCase(): any {
    throw new Error("Method not implemented.");
  }
    _id: string;
    name: string;
    img: File;
    description: string;
    price: string;
    weight: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
}
