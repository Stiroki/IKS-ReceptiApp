import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepBuilder } from './step-builder';

describe('StepBuilder', () => {
  let component: StepBuilder;
  let fixture: ComponentFixture<StepBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(StepBuilder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
