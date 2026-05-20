import type { Resume } from "../../domain/entities/Resume";

export interface ResumeRepository {
  getResumeData(): Promise<Resume>;
}
