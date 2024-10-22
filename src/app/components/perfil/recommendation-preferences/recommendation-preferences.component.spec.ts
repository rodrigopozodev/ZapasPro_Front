import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationPreferencesComponent } from './recommendation-preferences.component';

describe('RecommendationPreferencesComponent', () => {
  let component: RecommendationPreferencesComponent;
  let fixture: ComponentFixture<RecommendationPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationPreferencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendationPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
