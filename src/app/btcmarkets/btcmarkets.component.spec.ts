import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtcmarketsComponent } from './btcmarkets.component';

describe('BtcmarketsComponent', () => {
  let component: BtcmarketsComponent;
  let fixture: ComponentFixture<BtcmarketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtcmarketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtcmarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
