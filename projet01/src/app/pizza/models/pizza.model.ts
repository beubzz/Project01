import { Ingredient } from "src/app/ingredient/models/ingredient";

export class Pizza {
    _id: string;
    name: string;
    img: Array<string>;
    description: string;
    lat: string;
    long: string;
    ingredients: Array<Ingredient>;
    createdAt: string;
    updatedAt: string;
}