import { AppError } from "../../../../shared/error/AppError";
import { ENV } from "../../../../shared/env/ENV";
import { sendMail } from "../../../../shared/mail/mailer";
import { ExamRepository } from "../../../exam/domain/repositories/ExamRepository";
import { ExamAttempt } from "../../../users/domain/entities/User";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";
import { mailTemplateForExamPassed } from "../../../../shared/mail/template";

export interface SaveExamResponseInput {
  examId: string;
  courseId: string;
  answers: Record<string, number>;
  status: "submitted" | "stopped";
  reason?: string;
}

export class SaveExamResponseUseCase {
  constructor(
    private userRepository: UserRepository,
    private examRepository: ExamRepository,
  ) {}

  async execute(
    studentId: string,
    input: SaveExamResponseInput,
  ): Promise<ExamAttempt> {
    const student = await this.userRepository.findById(studentId);

    if (!student) {
      throw new AppError("Student not found", 404);
    }

    const exam = await this.examRepository.findById(input.examId);

    if (!exam) {
      throw new AppError("Exam not found", 404);
    }

    if (String(exam.courseId) !== String(input.courseId)) {
      throw new AppError("Exam does not belong to this course", 400);
    }

    const hasPassedCourse = student.examAttempts?.some(
      (attempt) => attempt.courseId === input.courseId && attempt.isPassed,
    );

    if (hasPassedCourse) {
      throw new AppError("Exam already passed for this course", 400);
    }

    const answers = exam.questions.map((question, questionIndex) => {
      const selectedOptionIndex = Number(input.answers[String(questionIndex)]);
      const selectedOption = question.options[selectedOptionIndex];

      return {
        questionIndex,
        selectedOptionIndex: Number.isInteger(selectedOptionIndex)
          ? selectedOptionIndex
          : -1,
        isCorrect: Boolean(selectedOption?.isCorrect),
      };
    });

    const score = answers.reduce((total, answer) => {
      if (!answer.isCorrect) return total;

      return total + Number(exam.marksPerQuestion);
    }, 0);
    const totalMarks = exam.questions.length * Number(exam.marksPerQuestion);
    const isPassed =
      input.status === "submitted" && score >= Number(exam.passMarks);
    const attempt: ExamAttempt = {
      examId: input.examId,
      courseId: input.courseId,
      answers,
      score,
      totalMarks,
      passMarks: Number(exam.passMarks),
      isPassed,
      status: input.status,
      reason: input.reason,
      attemptedAt: new Date(),
    };

    await this.userRepository.saveExamAttempt(studentId, attempt);

    if (attempt.isPassed && attempt.status === "submitted") {
      await this.sendExamPassedNotification({
        studentName: student.name,
        studentEmail: student.email,
        examTitle: exam.title,
        courseId: input.courseId,
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        passMarks: attempt.passMarks,
        attemptedAt: attempt.attemptedAt,
      });
    }

    return attempt;
  }

  private async sendExamPassedNotification(params: {
    studentName: string;
    studentEmail: string;
    examTitle: string;
    courseId: string;
    score: number;
    totalMarks: number;
    passMarks: number;
    attemptedAt: Date;
  }): Promise<void> {
    const recipient = ENV.EXAM_PASS_NOTIFICATION_EMAIL;

    if (!recipient) {
      return;
    }

    try {
      const {
        studentName,
        studentEmail,
        examTitle,
        courseId,
        score,
        totalMarks,
        passMarks,
        attemptedAt,
      } = params;

      const percentage: number =
        totalMarks > 0 ? Number(((score / totalMarks) * 100).toFixed(2)) : 0;
      const attemptedAtText = attemptedAt.toISOString();

      await sendMail({
        to: recipient,
        subject: `Exam Passed: ${studentName} (${examTitle})`,
        text: [
          `Student ${studentName} (${studentEmail}) has passed an exam.`,
          `Exam: ${examTitle}`,
          `Course ID: ${courseId}`,
          `Score: ${score}/${totalMarks} (${percentage}%)`,
          `Pass Marks: ${passMarks}`,
          `Attempted At: ${attemptedAtText}`,
        ].join("\n"),
        html: mailTemplateForExamPassed({
          studentName,
          studentEmail,
          score,
          totalMarks,
          percentage,
          examTitle,
          passMarks,
          courseId,
          attemptedAtText,
        }),
      });
    } catch (error) {
      // Email delivery should not block exam submission.
      console.error("Failed to send exam pass notification email", error);
    }
  }
}
