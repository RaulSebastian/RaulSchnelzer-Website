import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidGradientDivComponent } from './fluid-gradient-div.component';

describe('FluidGradientDivComponent', () => {
  let component: FluidGradientDivComponent;
  let fixture: ComponentFixture<FluidGradientDivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluidGradientDivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidGradientDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
