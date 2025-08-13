import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiometriaComponent } from './audiometria.component';

describe('AudiometriaComponent', () => {
  let component: AudiometriaComponent;
  let fixture: ComponentFixture<AudiometriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AudiometriaComponent]
    });
    fixture = TestBed.createComponent(AudiometriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
