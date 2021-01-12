import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BowlingGameComponent } from './bowling-game.component';
import { ScoreService } from '../../services/score.service';

describe('BowlingGameComponent', () => {
  let component: BowlingGameComponent;
  let fixture: ComponentFixture<BowlingGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
     
      declarations: [ BowlingGameComponent ],
      imports : [ HttpClientTestingModule ],
      providers : [ScoreService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BowlingGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add new frames', () =>{
    component.addRollToFrame("1");
    component.addRollToFrame("2");

    expect(component.frames[0]).toEqual(["1","2"]);

    component.addRollToFrame("x");
    expect(component.frames[1]).toEqual(["X"]);

    component.addRollToFrame("X");
    expect(component.frames[2]).toEqual(["X"]);
  })

  it('spare input', ()=>{

    component.addRollToFrame("2");
    component.addRollToFrame("X");
    expect(component.validInput).toEqual(false);

    component.addRollToFrame("spare");
    expect(component.validInput).toEqual(true);

    component.addRollToFrame("spare");
    expect(component.validInput).toEqual(false);

  })

  it('strike input',()=>{
    component.addRollToFrame("X");
    expect(component.validInput).toEqual(true);
  })


  it('should create new game', ()=>{
    component.addRollToFrame("1");
    component.addRollToFrame("2");
    component.addRollToFrame("X");
    component.reset();
    expect(component.scores).toEqual([null,null,null,null,null,null,null,null,null,null]);
    expect(component.gameOver).toEqual(false);
    expect(component.frames).toEqual([[],[],[],[],[],[],[],[],[],[]]);
    expect(component.frameIndex).toEqual(0);
  })
});
