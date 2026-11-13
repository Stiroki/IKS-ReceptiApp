import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Allergen, Ingredient, IngredientCategory } from '../models/ingredient.model';

export interface CatalogItem {
  id: number;
  name: string;
  group: 'MEAL_TYPE' | 'DISH_TYPE' | 'DIET_TYPE';
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private recipeTypesSubject = new BehaviorSubject<CatalogItem[]>([
    { id: 1, name: 'doručak', group: 'MEAL_TYPE' },
    { id: 2, name: 'ručak', group: 'MEAL_TYPE' },
    { id: 3, name: 'večera', group: 'MEAL_TYPE' },
    { id: 4, name: 'glavna jela', group: 'MEAL_TYPE' },
    { id: 5, name: 'predjela', group: 'MEAL_TYPE' },
    { id: 6, name: 'salate', group: 'MEAL_TYPE' },
    { id: 7, name: 'deserti', group: 'MEAL_TYPE' },
    { id: 8, name: 'pića', group: 'MEAL_TYPE' },
    { id: 9, name: 'supa', group: 'DISH_TYPE' },
    { id: 10, name: 'testenina', group: 'DISH_TYPE' },
    { id: 11, name: 'pica', group: 'DISH_TYPE' },
    { id: 12, name: 'sendvič', group: 'DISH_TYPE' },
    { id: 13, name: 'jelo od mesa', group: 'DISH_TYPE' },
    { id: 14, name: 'kolač', group: 'DISH_TYPE' },
    { id: 15, name: 'palačinke', group: 'DISH_TYPE' },
    { id: 16, name: 'vegetarijanska', group: 'DIET_TYPE' },
    { id: 17, name: 'veganska', group: 'DIET_TYPE' },
    { id: 18, name: 'posna', group: 'DIET_TYPE' },
    { id: 19, name: 'mrsna', group: 'DIET_TYPE' },
    { id: 20, name: 'hrono', group: 'DIET_TYPE' },
    { id: 21, name: 'pesketarijanska', group: 'DIET_TYPE' }
  ]);

  private categoriesSubject = new BehaviorSubject<IngredientCategory[]>([
    { id: 1, name: 'povrće' },
    { id: 2, name: 'voće' },
    { id: 3, name: 'meso' },
    { id: 4, name: 'riba' },
    { id: 5, name: 'mlečni proizvodi' },
    { id: 6, name: 'žitarice' },
    { id: 7, name: 'začini' },
    { id: 8, name: 'orašasti plodovi' }
  ]);

  private allergensSubject = new BehaviorSubject<Allergen[]>([
    { id: 1, name: 'gluten' },
    { id: 2, name: 'mleko' },
    { id: 3, name: 'jaja' },
    { id: 4, name: 'kikiriki' },
    { id: 5, name: 'orašasti plodovi' },
    { id: 6, name: 'soja' }
  ]);

  private ingredientsSubject = new BehaviorSubject<Ingredient[]>([
    {
      id: 1,
      name: 'Brašno tip 400',
      category: { id: 6, name: 'žitarice' },
      defaultUnit: 'gram',
      isBranded: false,
      allergens: [{ id: 1, name: 'gluten' }]
    },
    {
      id: 2,
      name: 'Mleko 2.8%',
      category: { id: 5, name: 'mlečni proizvodi' },
      defaultUnit: 'mililitar',
      isBranded: true,
      brandName: 'Imlek Moja Kravica',
      allergens: [{ id: 2, name: 'mleko' }]
    },
    {
      id: 3,
      name: 'Jaja',
      category: { id: 3, name: 'meso' },
      defaultUnit: 'komad',
      isBranded: false,
      allergens: [{ id: 3, name: 'jaja' }]
    },
    {
      id: 4,
      name: 'Kikiriki puter',
      category: { id: 8, name: 'orašasti plodovi' },
      defaultUnit: 'gram',
      isBranded: true,
      brandName: 'GymBeam',
      allergens: [{ id: 4, name: 'kikiriki' }]
    },
    {
      id: 5,
      name: 'So',
      category: { id: 7, name: 'začini' },
      defaultUnit: 'po ukusu',
      isBranded: false,
      allergens: []
    }
  ]);

  getRecipeTypes(): Observable<CatalogItem[]> { return this.recipeTypesSubject.asObservable(); }
  getCategories(): Observable<IngredientCategory[]> { return this.categoriesSubject.asObservable(); }
  getAllergens(): Observable<Allergen[]> { return this.allergensSubject.asObservable(); }
  getIngredients(): Observable<Ingredient[]> { return this.ingredientsSubject.asObservable(); }

  // Admin CRUD metode za Stavku 3.2
  addRecipeType(name: string, group: CatalogItem['group']): void {
    const current = this.recipeTypesSubject.value;
    const nextId = current.length ? Math.max(...current.map(i => i.id)) + 1 : 1;
    this.recipeTypesSubject.next([...current, { id: nextId, name, group }]);
  }

  deleteRecipeType(id: number): void {
    this.recipeTypesSubject.next(this.recipeTypesSubject.value.filter(i => i.id !== id));
  }

  addCategory(name: string): void {
    const current = this.categoriesSubject.value;
    const nextId = current.length ? Math.max(...current.map(i => i.id)) + 1 : 1;
    this.categoriesSubject.next([...current, { id: nextId, name }]);
  }

  deleteCategory(id: number): void {
    this.categoriesSubject.next(this.categoriesSubject.value.filter(i => i.id !== id));
  }

  addAllergen(name: string): void {
    const current = this.allergensSubject.value;
    const nextId = current.length ? Math.max(...current.map(i => i.id)) + 1 : 1;
    this.allergensSubject.next([...current, { id: nextId, name }]);
  }

  deleteAllergen(id: number): void {
    this.allergensSubject.next(this.allergensSubject.value.filter(i => i.id !== id));
  }
}
