import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricBorderComponent } from './electric-border.component';

describe('ElectricBorderComponent', () => {
  let component: ElectricBorderComponent;
  let fixture: ComponentFixture<ElectricBorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectricBorderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectricBorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
