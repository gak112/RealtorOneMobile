import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HouseFactsFeaturesComponent } from './house-facts-features.component';

describe('HouseFactsFeaturesComponent', () => {
  let component: HouseFactsFeaturesComponent;
  let fixture: ComponentFixture<HouseFactsFeaturesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseFactsFeaturesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HouseFactsFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
