import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHistoryComponent } from './card-history.component';

describe('CartHistoryComponent', () => {
  let component: CardHistoryComponent;
  let fixture: ComponentFixture<CardHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
