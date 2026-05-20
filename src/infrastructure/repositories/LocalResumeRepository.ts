import type { Resume } from "../../domain/entities/Resume";
import type { ResumeRepository } from "../../application/repositories/ResumeRepository";
import { mockDatabase } from "../data/resumeDatabase";

export class LocalResumeRepository implements ResumeRepository {
  async getResumeData(): Promise<Resume> {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDatabase);
      }, 300);
    });
  }
}
