import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CatalogItem, CatalogService } from '../../../../core/services/catalog.service';

export interface UnifiedCatalogRow {
  id: number;
  name: string;
  entityType: 'TIP_RECEPTA' | 'KATEGORIJA_NAMIRNICA' | 'ALERGEN';
  subGroup: string;
}

@Component({
  selector: 'app-catalog-management',
  standalone: false,
  templateUrl: './catalog-management.html',
  styleUrl: './catalog-management.css'
})
export class CatalogManagement implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'entityType', 'subGroup', 'actions'];
  dataSource = new MatTableDataSource<UnifiedCatalogRow>([]);

  newName = '';
  newEntityType: UnifiedCatalogRow['entityType'] = 'TIP_RECEPTA';
  newSubGroup: CatalogItem['group'] = 'MEAL_TYPE';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private types: CatalogItem[] = [];
  private categories: { id: number; name: string }[] = [];
  private allergens: { id: number; name: string }[] = [];

  constructor(private catalogService: CatalogService) {}

  ngOnInit(): void {
    this.catalogService.getRecipeTypes().subscribe(t => {
      this.types = t;
      this.rebuildTable();
    });
    this.catalogService.getCategories().subscribe(c => {
      this.categories = c;
      this.rebuildTable();
    });
    this.catalogService.getAllergens().subscribe(a => {
      this.allergens = a;
      this.rebuildTable();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private rebuildTable(): void {
    this.dataSource.data = [
      ...this.types.map(t => ({
        id: t.id,
        name: t.name,
        entityType: 'TIP_RECEPTA' as const,
        subGroup: t.group
      })),
      ...this.categories.map(c => ({
        id: c.id,
        name: c.name,
        entityType: 'KATEGORIJA_NAMIRNICA' as const,
        subGroup: 'Kategorija namirnice'
      })),
      ...this.allergens.map(a => ({
        id: a.id,
        name: a.name,
        entityType: 'ALERGEN' as const,
        subGroup: 'Alergen'
      }))
    ];
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addItem(): void {
    const trimmed = this.newName.trim();
    if (!trimmed) return;

    if (this.newEntityType === 'TIP_RECEPTA') {
      this.catalogService.addRecipeType(trimmed, this.newSubGroup);
    } else if (this.newEntityType === 'KATEGORIJA_NAMIRNICA') {
      this.catalogService.addCategory(trimmed);
    } else {
      this.catalogService.addAllergen(trimmed);
    }
    this.newName = '';
  }

  deleteItem(row: UnifiedCatalogRow): void {
    if (row.entityType === 'TIP_RECEPTA') {
      this.catalogService.deleteRecipeType(row.id);
    } else if (row.entityType === 'KATEGORIJA_NAMIRNICA') {
      this.catalogService.deleteCategory(row.id);
    } else {
      this.catalogService.deleteAllergen(row.id);
    }
  }
}
