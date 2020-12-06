import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FluidGradientDivComponent } from './fluid-gradient-div.component';

describe('FluidGradientDivComponent', () => {
  let component: FluidGradientDivComponent;
  let fixture: ComponentFixture<FluidGradientDivComponent>;

  beforeEach(waitForAsync(() => {
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
