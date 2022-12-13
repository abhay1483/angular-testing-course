import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CoursesCardListComponent } from './courses-card-list.component';
import { CoursesModule } from '../courses.module';
import { COURSES } from '../../../../server/db-data';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { sortCoursesBySeqNo } from '../home/sort-course-by-seq';
import { Course } from '../model/course';
import { setupCourses } from '../common/setup-test-data';


describe('CoursesCardListComponent', () => {

  let fixture: ComponentFixture<CoursesCardListComponent>;
  let component: CoursesCardListComponent;
  let el: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CoursesModule
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(CoursesCardListComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
    })
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display the course list", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const cards = el.queryAll(By.css(".course-card"));
    console.log(el.nativeElement.outerHTML);
    expect(cards).toBeTruthy("Could not find cards");
    expect(cards.length).toBe(12);

  });


  it("should display the first course", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const firstCard = el.query(By.css(".course-card:first-child")),
      title = firstCard.query(By.css("mat-card-title"));

    expect(firstCard).toBeTruthy("couldn't get the card ");
    expect(title.nativeElement.textContent).toEqual("Angular Testing Course");

  });


});


