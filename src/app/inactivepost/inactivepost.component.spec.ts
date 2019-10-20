import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InactivepostComponent } from './inactivepost.component';

describe('InactivepostComponent', () => {
  let component: InactivepostComponent;
  let fixture: ComponentFixture<InactivepostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InactivepostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InactivepostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
