import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private readonly STORAGE_KEY = 'kt1_recipes';

  private initialRecipes: Recipe[] = [
    {
      id: 1,
      title: 'Domaći hleb iz rerne',
      authorId: 1,
      authorUsername: 'zorana_chef',
      authorRegion: 'Vojvodina, Srbija',
      mealTypes: ['doručak', 'večera'],
      dishType: 'pekarski proizvod',
      dietTypes: ['vegetarijanska'],
      allergens: [
        { id: 1, name: 'gluten' },
        { id: 2, name: 'mleko' },
        { id: 3, name: 'jaja' }
      ],
      servings: 4,
      totalPrepTimeMinutes: 50,
      mainImageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
      ingredients: [
        {
          ingredient: {
            id: 1,
            name: 'Brašno tip 400',
            category: { id: 6, name: 'žitarice' },
            defaultUnit: 'gram',
            isBranded: false,
            allergens: [{ id: 1, name: 'gluten' }]
          },
          amount: 500,
          unit: 'gram'
        },
        {
          ingredient: {
            id: 2,
            name: 'Mleko 2.8%',
            category: { id: 5, name: 'mlečni proizvodi' },
            defaultUnit: 'mililitar',
            isBranded: true,
            brandName: 'Imlek Moja Kravica',
            allergens: [{ id: 2, name: 'mleko' }]
          },
          amount: 250,
          unit: 'mililitar'
        },
        {
          ingredient: {
            id: 3,
            name: 'Jaja',
            category: { id: 3, name: 'meso' },
            defaultUnit: 'komad',
            isBranded: false,
            allergens: [{ id: 3, name: 'jaja' }]
          },
          amount: 3,
          unit: 'komad'
        }
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Priprema testa',
          description: 'Pomešati brašno, jaja i mleko dok se masa ne sjedini.',
          preparationType: 'BEZ_TERMICKE_OBRADE',
          durationMinutes: 5
        },
        {
          stepNumber: 2,
          title: 'Odmaranje testa',
          description: 'Ostaviti testo da odstoji 20 minuta.',
          preparationType: 'BEZ_TERMICKE_OBRADE',
          durationMinutes: 20
        },
        {
          stepNumber: 3,
          title: 'Pečenje hleba',
          description: 'Podmazati pleh i peći 25 minuta na 200 stepeni.',
          preparationType: 'PECENJE',
          durationMinutes: 25
        }
      ],
      origin: { country: 'Srbija', region: 'Vojvodina', city: 'Novi Sad' },
      story: 'Porodični recept moje bake koji uspeva baš svaki put.',
      averageRating: 4.8,
      ratingsCount: 12,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Kremaste proteinske palačinke sa kikirikijem',
      authorId: 1,
      authorUsername: 'zorana_chef',
      authorRegion: 'Vojvodina, Srbija',
      mealTypes: ['doručak', 'deserti'],
      dishType: 'palačinke',
      dietTypes: ['vegetarijanska'],
      allergens: [
        { id: 1, name: 'gluten' },
        { id: 4, name: 'kikiriki' }
      ],
      servings: 2,
      totalPrepTimeMinutes: 20,
      mainImageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600',
      ingredients: [
        {
          ingredient: {
            id: 1,
            name: 'Brašno tip 400',
            category: { id: 6, name: 'žitarice' },
            defaultUnit: 'gram',
            isBranded: false,
            allergens: [{ id: 1, name: 'gluten' }]
          },
          amount: 150,
          unit: 'gram'
        },
        {
          ingredient: {
            id: 4,
            name: 'Kikiriki puter',
            category: { id: 8, name: 'orašasti plodovi' },
            defaultUnit: 'gram',
            isBranded: true,
            brandName: 'GymBeam',
            allergens: [{ id: 4, name: 'kikiriki' }]
          },
          amount: 40,
          unit: 'gram'
        }
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Prženje palačinki',
          description: 'Peći na tiganju po 2 minuta sa svake strane i premazati kikiriki puterom.',
          preparationType: 'PRZENJE',
          durationMinutes: 15
        }
      ],
      origin: { country: 'Srbija', region: 'Vojvodina', city: 'Novi Sad' },
      story: 'Brzi doručak posle treninga.',
      averageRating: 4.9,
      ratingsCount: 8,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Šumadijska čorba',
      authorId: 2,
      authorUsername: 'marko_kuvar',
      authorRegion: 'Šumadija, Srbija',
      mealTypes: ['ručak'],
      dishType: 'supa',
      dietTypes: ['mrsna'],
      allergens: [{ id: 1, name: 'gluten' }],
      servings: 6,
      totalPrepTimeMinutes: 45,
      mainImageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600',
      ingredients: [],
      steps: [
        {
          stepNumber: 1,
          title: 'Kuvanje na tihoj vatri',
          description: 'Kuvati sve sastojke 45 minuta.',
          preparationType: 'KUVANJE',
          durationMinutes: 45
        }
      ],
      averageRating: 4.5,
      ratingsCount: 5,
      createdAt: new Date().toISOString()
    }
  ];

  private recipesSubject = new BehaviorSubject<Recipe[]>(this.loadRecipes());

  constructor(private userService: UserService) {}

  private loadRecipes(): Recipe[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : this.initialRecipes;
  }

  private saveRecipes(recipes: Recipe[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recipes));
    this.recipesSubject.next(recipes);
  }

  getRecipes(): Observable<Recipe[]> {
    return this.recipesSubject.asObservable();
  }

  getRecipeById(id: number): Recipe | undefined {
    return this.recipesSubject.value.find(r => r.id === id);
  }

  getRecipesByAuthor(username: string): Recipe[] {
    return this.recipesSubject.value.filter(r => r.authorUsername === username);
  }

  createRecipe(recipeData: Omit<Recipe, 'id' | 'createdAt' | 'averageRating' | 'ratingsCount'>): Recipe {
    const current = this.recipesSubject.value;
    const nextId = current.length ? Math.max(...current.map(r => r.id)) + 1 : 1;
    const newRecipe: Recipe = {
      ...recipeData,
      id: nextId,
      averageRating: 0,
      ratingsCount: 0,
      createdAt: new Date().toISOString()
    };
    const updated = [newRecipe, ...current];
    this.saveRecipes(updated);
    this.syncAuthorCount(newRecipe.authorId, updated);
    return newRecipe;
  }

  updateRecipe(id: number, updatedData: Partial<Recipe>): void {
    const updated = this.recipesSubject.value.map(r =>
      r.id === id ? { ...r, ...updatedData } : r
    );
    this.saveRecipes(updated);
  }

  deleteRecipe(id: number): void {
    const target = this.getRecipeById(id);
    const updated = this.recipesSubject.value.filter(r => r.id !== id);
    this.saveRecipes(updated);
    if (target) {
      this.syncAuthorCount(target.authorId, updated);
    }
  }

  private syncAuthorCount(authorId: number, allRecipes: Recipe[]): void {
    const count = allRecipes.filter(r => r.authorId === authorId).length;
    this.userService.updateRecipeCount(authorId, count);
  }
}
