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
  private readonly TYPES_KEY = 'kt1_catalog_types';
  private readonly CATS_KEY = 'kt1_catalog_categories';
  private readonly ALLERGENS_KEY = 'kt1_catalog_allergens';

  private defaultTypes: CatalogItem[] = [
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
    { id: 14, name: 'pekarski proizvod', group: 'DISH_TYPE' },
    { id: 15, name: 'kolač', group: 'DISH_TYPE' },
    { id: 16, name: 'palačinke', group: 'DISH_TYPE' },
    { id: 17, name: 'vegetarijanska', group: 'DIET_TYPE' },
    { id: 18, name: 'veganska', group: 'DIET_TYPE' },
    { id: 19, name: 'posna', group: 'DIET_TYPE' },
    { id: 20, name: 'mrsna', group: 'DIET_TYPE' },
    { id: 21, name: 'hrono', group: 'DIET_TYPE' },
    { id: 22, name: 'pesketarijanska', group: 'DIET_TYPE' }
  ];

  private defaultCategories: IngredientCategory[] = [
    { id: 1, name: 'povrće' },
    { id: 2, name: 'voće' },
    { id: 3, name: 'meso' },
    { id: 4, name: 'riba' },
    { id: 5, name: 'mlečni proizvodi' },
    { id: 6, name: 'žitarice' },
    { id: 7, name: 'začini' },
    { id: 8, name: 'orašasti plodovi' }
  ];

  private defaultAllergens: Allergen[] = [
    { id: 1, name: 'gluten' },
    { id: 2, name: 'mleko' },
    { id: 3, name: 'jaja' },
    { id: 4, name: 'kikiriki' },
    { id: 5, name: 'orašasti plodovi' },
    { id: 6, name: 'soja' }
  ];

  private recipeTypesSubject = new BehaviorSubject<CatalogItem[]>(
    this.loadFromStorage(this.TYPES_KEY, this.defaultTypes)
  );
  private categoriesSubject = new BehaviorSubject<IngredientCategory[]>(
    this.loadFromStorage(this.CATS_KEY, this.defaultCategories)
  );
  private allergensSubject = new BehaviorSubject<Allergen[]>(
    this.loadFromStorage(this.ALLERGENS_KEY, this.defaultAllergens)
  );

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

  private loadFromStorage<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }

  getRecipeTypes(): Observable<CatalogItem[]> { return this.recipeTypesSubject.asObservable(); }
  getCategories(): Observable<IngredientCategory[]> { return this.categoriesSubject.asObservable(); }
  getAllergens(): Observable<Allergen[]> { return this.allergensSubject.asObservable(); }
  getIngredients(): Observable<Ingredient[]> { return this.ingredientsSubject.asObservable(); }

  addRecipeType(name: string, group: CatalogItem['group']): void {
    const current = this.recipeTypesSubject.value;
    const nextId = current.length ? Math.max(...current.map(i => i.id)) + 1 : 1;
    const updated = [...current, { id: nextId, name, group }];
    localStorage.setItem(this.TYPES_KEY, JSON.stringify(updated));
    this.recipeTypesSubject.next(updated);
  }

  deleteRecipeType(id: number): void {
    const updated = this.recipeTypesSubject.value.filter(i => i.id !== id);
    localStorage.setItem(this.TYPES_KEY, JSON.stringify(updated));
    this.recipeTypesSubject.next(updated);
  }

  addCategory(name: string): void {
    const current = this.categoriesSubject.value;
    const nextId = current.length ? Math.max(...current.map(i => i.id)) + 1 : 1;
    const updated = [...current, { id: nextId, name }];
    localStorage.setItem(this.CATS_KEY, JSON.stringify(updated));
    this.categoriesSubject.next(updated);
  }

  deleteCategory(id: number): void {
    const updated = this.categoriesSubject.value.filter(i => i.id !== id);
    localStorage.setItem(this.CATS_KEY, JSON.stringify(updated));
    this.categoriesSubject.next(updated);
  }

  addAllergen(name: string): void {
    const current = this.allergensSubject.value;
    const nextId = current.length ? Math.max(...current.map(i => i.id)) + 1 : 1;
    const updated = [...current, { id: nextId, name }];
    localStorage.setItem(this.ALLERGENS_KEY, JSON.stringify(updated));
    this.allergensSubject.next(updated);
  }

  deleteAllergen(id: number): void {
    const updated = this.allergensSubject.value.filter(i => i.id !== id);
    localStorage.setItem(this.ALLERGENS_KEY, JSON.stringify(updated));
    this.allergensSubject.next(updated);
  }
}
