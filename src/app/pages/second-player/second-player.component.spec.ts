import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondPlayerComponent } from './second-player.component';

describe('SecondPlayerComponent', () => {
  let component: SecondPlayerComponent;
  let fixture: ComponentFixture<SecondPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
