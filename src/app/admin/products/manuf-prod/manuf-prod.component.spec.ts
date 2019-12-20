/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManufProdComponent } from './manuf-prod.component';

describe('ManufProdComponent', () => {
  let component: ManufProdComponent;
  let fixture: ComponentFixture<ManufProdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufProdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
