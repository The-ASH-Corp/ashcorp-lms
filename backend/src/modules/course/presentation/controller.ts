import { NextFunction, Request, Response } from "express";
import {
  addReviewUseCase,
  courseFindAllUseCase,
  createCourseUseCase,
  deleteCourseUseCase,
  getCourseByIdUseCase,
  makeCourseFreeAndPublishedUseCase,
  updateCourseUseCase,
} from "../di";
import { CourseRequestDTO } from "../application/dto/CourseDTO";
import { AppError } from "../../../shared/error/AppError";
import { serializeCourse } from "../../../shared/config/serializeCourses";
import { uploadToS3 } from "../../../shared/middleware/s3Uplosd";


type UploadedFile = Express.Multer.File;
type UploadedFileMap = {
  thumbnail?: UploadedFile[];
  introVideo?: UploadedFile[];
};

export const getAllCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Number(req.query.page ?? 0);
    const limit = Number(req.query.limit ?? 0);
    const searchTerm = typeof req.query.search === "string" ? req.query.search : undefined;

    if (page > 0 && limit > 0) {
      const result = await courseFindAllUseCase.execute({ page, limit, searchTerm });

      if (!Array.isArray(result)) {
        const serializedCourses = await Promise.all(result.courses.map(serializeCourse));

        res.status(200).json({
          success: true,
          data: serializedCourses,
          pagination: {
            totalCourses: result.totalCourses,
            totalPages: Math.max(1, Math.ceil(result.totalCourses / limit)),
            currentPage: page,
            limit,
          },
        });
        return;
      }
    }

    const coursesResult = await courseFindAllUseCase.execute();
    const courses = Array.isArray(coursesResult) ? coursesResult : coursesResult.courses;
    const serializedCourses = await Promise.all(courses.map(serializeCourse));

    res.status(200).json({
      success: true,
      data: serializedCourses,
    });
  } catch (error) {
    next(error);
  }
};

export const createCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = req.body as Record<string, unknown>;
    const files = (req as Request & { files?: UploadedFileMap }).files;
    const thumbnail = files?.thumbnail?.[0];
    const introVideo = files?.introVideo?.[0];

    if (!thumbnail || !introVideo) {
      throw new AppError("Thumbnail and intro video are required", 400);
    }

    const [thumbnailUpload, introVideoUpload] = await Promise.all([
      uploadToS3(thumbnail, [String(body.title ?? ""), "thumbnail"]),
      uploadToS3(introVideo, [String(body.title ?? ""), "intro-video"]),
    ]);

    const courseData: CourseRequestDTO = {
      title: String(body.title ?? ""),
      description: String(body.description ?? ""),
      price: Number(body.price ?? 0),
      offerPrice: Number(body.offerPrice ?? 0),
      instructor: String(body.instructor ?? ""),
      category: String(body.category ?? ""),
      imageUrl: thumbnailUpload.url,
      videoUrl: introVideoUpload.url,
    };

    const course = await createCourseUseCase.execute(courseData);
    const serializedCourse = await serializeCourse(course);

    res.status(201).json({
      success: true,
      data: serializedCourse,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const course = await getCourseByIdUseCase.execute(id);

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    const serializedCourse = await serializeCourse(course);

    res.status(200).json({
      success: true,
      data: serializedCourse,
    });
  } catch (error) {
    next(error);
  }
};


export const updateCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const body = req.body as Record<string, unknown>;
    const files = (req as Request & { files?: UploadedFileMap }).files;
    const thumbnail = files?.thumbnail?.[0];
    const introVideo = files?.introVideo?.[0];

    let imageUrl: string | undefined;
    let videoUrl: string | undefined;

    if (thumbnail || introVideo) {
      const uploads = await Promise.all([
        thumbnail ? uploadToS3(thumbnail, [String(body.title ?? ""), "thumbnail"]) : Promise.resolve(null),
        introVideo ? uploadToS3(introVideo, [String(body.title ?? ""), "intro-video"]) : Promise.resolve(null),
      ]);

      imageUrl = uploads[0]?.url;
      videoUrl = uploads[1]?.url;
    }

    const course = await updateCourseUseCase.execute(id, {
      title: typeof body.title === "string" ? body.title : undefined,
      description: typeof body.description === "string" ? body.description : undefined,
      price: typeof body.price === "string" ? Number(body.price) : undefined,
      offerPrice: typeof body.offerPrice === "string" ? Number(body.offerPrice) : undefined,
      instructor: typeof body.instructor === "string" ? body.instructor : undefined,
      category: typeof body.category === "string" ? body.category : undefined,
      imageUrl,
      videoUrl,
      isPublished: typeof body.isPublished === "string" ? body.isPublished === "true" : undefined,
    });

    const serializedCourse = await serializeCourse(course);

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: serializedCourse,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourseController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    await deleteCourseUseCase.execute(id);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const makeCourseFreeAndPublishedController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const course = await makeCourseFreeAndPublishedUseCase.execute(id);
    const serializedCourse = await serializeCourse(course);

    res.status(200).json({
      success: true,
      message: "Course changed to free and published successfully",
      data: serializedCourse,
    });
  } catch (error) {
    next(error);
  }
};

export const addReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const courseId = String(req.params.courseId);

    if (!req.userId) {
      throw new AppError("Unauthorized", 401);
    }

    const { rating, review } = req.body;

    const course = await addReviewUseCase.execute(
      courseId,
      String(req.userId),
      rating,
      review,
    );

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};
