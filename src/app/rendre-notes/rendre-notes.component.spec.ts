import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendreNotesComponent } from './rendre-notes.component';

describe('RendreNotesComponent', () => {
  let component: RendreNotesComponent;
  let fixture: ComponentFixture<RendreNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RendreNotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendreNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
