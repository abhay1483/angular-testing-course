import { CoursesService } from './courses.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { COURSES, findLessonsForCourse } from '../../../../server/db-data';
import { HttpErrorResponse } from '@angular/common/http';

describe("CoursesService", () => {

    let coursesService: CoursesService,
        httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                CoursesService
            ]
        });

        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it("should get all courses", () => {
        coursesService.findAllCourses().subscribe(courses => {
            expect(courses).toBeTruthy("Invalid courses");
            expect(courses.length).toBe(12, "Length is not 12");
            const course = courses.find(course => course.id === 12);
            expect(course.titles.description).toBe('Angular Testing Course');
        });

        const req = httpTestingController.expectOne("/api/courses");
        expect(req.request.method).toBe("GET");

        req.flush({ payload: Object.values(COURSES) });
    });

    it("should get course by id", () => {
        coursesService.findCourseById(12).subscribe(course => {
            expect(course).toBeTruthy("Invalid course");
            expect(course.id).toBe(12, "ID not 12");
        });

        const req = httpTestingController.expectOne("/api/courses/12");
        expect(req.request.method).toBe("GET");

        req.flush(COURSES[12]);
    });

    it("should save the course", () => {
        const changes = { titles: { description: "Testing course description" } }
        coursesService.saveCourse(12, changes).subscribe(course => {
            expect(course.id).toBe(12);
        });

        const req = httpTestingController.expectOne("/api/courses/12");
        expect(req.request.method).toBe("PUT");
        expect(req.request.body.titles.description).toEqual(changes.titles.description);
        req.flush({ ...COURSES[12], ...changes });
    });

    it("should fail to save course", () => {
        const changes = { titles: { description: "Testing course description" } };
        coursesService.saveCourse(12, changes).subscribe(() => {
            fail("Save course failed")
        }, (error: HttpErrorResponse) => {
            expect(error.status).toBe(500);
        });
        const req = httpTestingController.expectOne("/api/courses/12");
        expect(req.request.method).toBe("PUT");
        req.flush("Save course failed", { status: 500, statusText: "Internal server error" });
    });

    it("should find all lessons", () => {
        coursesService.findLessons(12).subscribe(lesson => {
            expect(lesson).toBeTruthy();
            expect(lesson.length).toBe(3);
        });
        const req = httpTestingController.expectOne(req => req.url === '/api/lessons');
        expect(req.request.method).toBe("GET");
        expect(req.request.params.get('courseId')).toEqual("12");
        expect(req.request.params.get('pageSize')).toEqual("3");
        req.flush({ payload: findLessonsForCourse(12).slice(0, 3) });
    });

    afterEach(() => {
        httpTestingController.verify();
    });
});