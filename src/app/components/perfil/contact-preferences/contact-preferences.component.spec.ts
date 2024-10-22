import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPreferencesComponent } from './contact-preferences.component';

describe('ContactPreferencesComponent', () => {
  let component: ContactPreferencesComponent;
  let fixture: ComponentFixture<ContactPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactPreferencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
