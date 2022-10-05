import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('stone count should be one and stone should be drop to first store', () => {
    const fixComp =  fixture.componentInstance
    const mainIndex = 0;
    const currentIndex = 5;
    const count = 1;
    fixComp.stoneCountIsOneAndNextIndexIsStore(mainIndex, currentIndex, count);
    expect(fixComp.stores[fixComp.store1Index].length).toEqual(1);
  });

  it('stone count should be more than one and last stone should be drop to first store', () => {
    const fixComp =  fixture.componentInstance
    const mainIndex = 2;
    const currentIndex = 3;
    const count = 4;
    fixComp.stoneCountIsMoreThanOneAndNextIndexIsStore(mainIndex, currentIndex, count);
    expect(fixComp.stores[fixComp.store1Index].length).toEqual(1);
  });

  it('stone count should be one and stone should be drop to second store', () => {
    const fixComp =  fixture.componentInstance
    const mainIndex = 11;
    const currentIndex = 11;
    const count = 1;
    fixComp.stoneCountIsOneAndNextIndexIsStore(mainIndex, currentIndex, count);
    expect(fixComp.stores[fixComp.store2Index].length).toEqual(1);
  });

  it('stone count should be more than one and last stone should be drop to second store', () => {
    const fixComp =  fixture.componentInstance
    const mainIndex = 9;
    const currentIndex = 9;
    const count = 4;
    fixComp.stoneCountIsMoreThanOneAndNextIndexIsStore(mainIndex, currentIndex, count);
    expect(fixComp.stores[fixComp.store2Index].length).toEqual(1);
  });

});
