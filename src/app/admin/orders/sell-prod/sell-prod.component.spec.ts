/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SellProdComponent } from './sell-prod.component';

describe('SellProdComponent', () => {
  let component: SellProdComponent;
  let fixture: ComponentFixture<SellProdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellProdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
