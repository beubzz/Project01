import { Ingredient } from "src/app/ingredient/models/ingredient";

export class Pizza {
    _id: string;
    name: string;
    img: File;
    description: string;
    lat: string;
    long: string;
    ingredient: Array<Ingredient>;
    createdAt: string;
    updatedAt: string;
}