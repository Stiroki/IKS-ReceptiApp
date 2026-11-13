import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CatalogItem, CatalogService } from '../../../../core/services/catalog.service';
import { RecipeService } from '../../../../core/services/recipe.service';
import { UserService } from '../../../../core/services/user.service';
import { Allergen, Ingredient } from '../../../../core/models/ingredient.model';
import { PreparationType } from '../../../../core/models/recipe.model';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

interface StepFormValue {
  title: string;
  description: string;
  imageUrl?: string;
  preparationType: PreparationType;
  durationMinutes?: number;
}

@Component({
  selector: 'app-recipe-form',
  standalone: false,
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.css'
})
export class RecipeForm implements OnInit {
  isEditMode = false;
  editingRecipeId?: number;

  basicForm!: FormGroup;
  ingredientsForm!: FormGroup;
  stepsForm!: FormGroup;
  mediaOriginForm!: FormGroup;

  mealTypesList: CatalogItem[] = [];
  dishTypesList: CatalogItem[] = [];
  dietTypesList: CatalogItem[] = [];
  availableIngredients: Ingredient[] = [];

  preparationTypes: { value: PreparationType; label: string }[] = [
    { value: 'KUVANJE', label: 'Kuvanje' },
    { value: 'PECENJE', label: 'Pečenje' },
    { value: 'PRZENJE', label: 'Prženje' },
    { value: 'DINSTANJE', label: 'Dinstanje' },
    { value: 'GRILOVANJE', label: 'Grilovanje' },
    { value: 'POHOVANJE', label: 'Pohovanje' },
    { value: 'KUVANJE_NA_PARI', label: 'Kuvanje na pari' },
    { value: 'BEZ_TERMICKE_OBRADE', label: 'Priprema bez termičke obrade' },
    { value: 'OSTALO', label: 'Ostalo' }
  ];

  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private recipeService: RecipeService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadCatalogs();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.editingRecipeId = Number(idParam);
      this.populateRecipeForEdit(this.editingRecipeId);
    } else {
      this.addIngredientRow();
      this.addStepRow();
    }
  }

  private initForms(): void {
    this.basicForm = this.fb.group({
      title: ['', Validators.required],
      mealTypes: [[], Validators.required],
      dishType: ['', Validators.required],
      dietTypes: [[], Validators.required],
      servings: [4, [Validators.required, Validators.min(1)]],
      totalPrepTimeMinutes: [30, [Validators.required, Validators.min(1)]],
      story: ['']
    });

    this.ingredientsForm = this.fb.group({
      items: this.fb.array([])
    });

    this.stepsForm = this.fb.group({
      steps: this.fb.array([])
    });

    this.mediaOriginForm = this.fb.group({
      mainImageUrl: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600', Validators.required],
      videoUrl: [''],
      country: ['Srbija'],
      region: ['Vojvodina'],
      city: ['Novi Sad']
    });
  }

  private loadCatalogs(): void {
    this.catalogService.getRecipeTypes().subscribe(items => {
      this.mealTypesList = items.filter(i => i.group === 'MEAL_TYPE');
      this.dishTypesList = items.filter(i => i.group === 'DISH_TYPE');
      this.dietTypesList = items.filter(i => i.group === 'DIET_TYPE');
    });
    this.catalogService.getIngredients().subscribe(ings => {
      this.availableIngredients = ings;
    });
  }

  get ingredientsArray(): FormArray {
    return this.ingredientsForm.get('items') as FormArray;
  }

  get stepsArray(): FormArray {
    return this.stepsForm.get('steps') as FormArray;
  }

  addIngredientRow(ing?: Ingredient, amount?: number, unit?: string): void {
    const group = this.fb.group({
      ingredient: [ing || null, Validators.required],
      amount: [amount ?? null], // Opciono za npr. "so po ukusu"
      unit: [unit || ing?.defaultUnit || 'gram', Validators.required]
    });

    group.get('ingredient')?.valueChanges.subscribe((selected: Ingredient | null) => {
      if (selected) {
        group.get('unit')?.setValue(selected.defaultUnit);
      }
    });

    this.ingredientsArray.push(group);
  }

  removeIngredientRow(index: number): void {
    this.ingredientsArray.removeAt(index);
  }

  // Stavka 3: Automatsko izračunavanje prisutnih alergena iz izabranih namirnica
  get detectedAllergens(): Allergen[] {
    const map = new Map<number, Allergen>();
    this.ingredientsArray.controls.forEach(ctrl => {
      const ing: Ingredient | null = ctrl.get('ingredient')?.value;
      ing?.allergens?.forEach(a => map.set(a.id, a));
    });
    return Array.from(map.values());
  }

  // Stavka 3.1: Korak pripreme sa uslovnim validatorom za trajanje
  addStepRow(existing?: StepFormValue): void {
    const type: PreparationType = existing?.preparationType || 'BEZ_TERMICKE_OBRADE';
    const isOptionalDuration = type === 'BEZ_TERMICKE_OBRADE' || type === 'OSTALO';

    const stepGroup = this.fb.group({
      title: [existing?.title || '', Validators.required],
      description: [existing?.description || '', Validators.required],
      imageUrl: [existing?.imageUrl || ''],
      preparationType: [type, Validators.required],
      durationMinutes: [
        existing?.durationMinutes ?? null,
        isOptionalDuration ? [] : [Validators.required, Validators.min(1)]
      ]
    });

    stepGroup.get('preparationType')?.valueChanges.subscribe((selectedType: PreparationType | null) => {
      const durationCtrl = stepGroup.get('durationMinutes');
      if (selectedType === 'BEZ_TERMICKE_OBRADE' || selectedType === 'OSTALO') {
        durationCtrl?.clearValidators();
      } else {
        durationCtrl?.setValidators([Validators.required, Validators.min(1)]);
      }
      durationCtrl?.updateValueAndValidity();
    });

    this.stepsArray.push(stepGroup);
  }

  removeStepRow(index: number): void {
    this.stepsArray.removeAt(index);
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.readImageFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.readImageFile(input.files[0]);
    }
  }

  private readImageFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.mediaOriginForm.patchValue({ mainImageUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  private populateRecipeForEdit(id: number): void {
    const recipe = this.recipeService.getRecipeById(id);
    if (!recipe) return;

    this.basicForm.patchValue({
      title: recipe.title,
      mealTypes: recipe.mealTypes,
      dishType: recipe.dishType,
      dietTypes: recipe.dietTypes,
      servings: recipe.servings,
      totalPrepTimeMinutes: recipe.totalPrepTimeMinutes,
      story: recipe.story || ''
    });

    recipe.ingredients.forEach(item => {
      const matchedIng = this.availableIngredients.find(i => i.id === item.ingredient.id) || item.ingredient;
      this.addIngredientRow(matchedIng, item.amount, item.unit);
    });

    recipe.steps.forEach(s => {
      this.addStepRow({
        title: s.title,
        description: s.description,
        imageUrl: s.imageUrl,
        preparationType: s.preparationType,
        durationMinutes: s.durationMinutes
      });
    });

    this.mediaOriginForm.patchValue({
      mainImageUrl: recipe.mainImageUrl,
      videoUrl: recipe.videoUrl || '',
      country: recipe.origin?.country || '',
      region: recipe.origin?.region || '',
      city: recipe.origin?.city || ''
    });
  }

  submitRecipe(): void {
    if (this.basicForm.invalid || this.ingredientsForm.invalid || this.stepsForm.invalid || this.mediaOriginForm.invalid) {
      return;
    }

    if (this.isEditMode && this.editingRecipeId) {
      const dialogRef = this.dialog.open(ConfirmDialog, {
        data: {
          title: 'Potvrda izmene recepta',
          message: 'Da li ste sigurni da želite da sačuvate izmene ovog recepta?',
          confirmText: 'Sačuvaj izmene',
          cancelText: 'Otkaži'
        }
      });

      dialogRef.afterClosed().subscribe(confirmed => {
        if (confirmed && this.editingRecipeId) {
          this.saveToService(this.editingRecipeId);
        }
      });
    } else {
      this.saveToService();
    }
  }

  private saveToService(existingId?: number): void {
    const currentUser = this.userService.currentUserValue;
    const rawSteps = this.stepsArray.value as StepFormValue[];
    const payload = {
      title: this.basicForm.value.title,
      authorId: currentUser.id,
      authorUsername: currentUser.username,
      authorRegion: currentUser.region,
      mealTypes: this.basicForm.value.mealTypes,
      dishType: this.basicForm.value.dishType,
      dietTypes: this.basicForm.value.dietTypes,
      allergens: this.detectedAllergens,
      servings: this.basicForm.value.servings,
      totalPrepTimeMinutes: this.basicForm.value.totalPrepTimeMinutes,
      story: this.basicForm.value.story,
      mainImageUrl: this.mediaOriginForm.value.mainImageUrl,
      videoUrl: this.mediaOriginForm.value.videoUrl,
      origin: {
        country: this.mediaOriginForm.value.country,
        region: this.mediaOriginForm.value.region,
        city: this.mediaOriginForm.value.city
      },
      ingredients: this.ingredientsArray.value,
      steps: rawSteps.map((s, idx) => ({
        ...s,
        stepNumber: idx + 1
      }))
    };

    if (existingId) {
      this.recipeService.updateRecipe(existingId, payload);
      this.router.navigate(['/recipes', existingId]);
    } else {
      const created = this.recipeService.createRecipe(payload);
      this.router.navigate(['/recipes', created.id]);
    }
  }
}
