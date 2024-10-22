import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnItemComponent } from './return-item.component';

describe('ReturnItemComponent', () => {
  let component: ReturnItemComponent;
  let fixture: ComponentFixture<ReturnItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
