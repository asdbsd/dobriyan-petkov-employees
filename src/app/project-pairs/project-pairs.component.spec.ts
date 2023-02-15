import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPairsComponent } from './project-pairs.component';

describe('ProjectPairsComponent', () => {
  let component: ProjectPairsComponent;
  let fixture: ComponentFixture<ProjectPairsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectPairsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
