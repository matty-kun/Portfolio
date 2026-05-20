import type { Resume } from "../../domain/entities/Resume";
import type { ResumeRepository } from "../repositories/ResumeRepository";

export class GetResumeUseCase {
  private readonly resumeRepository: ResumeRepository;

  constructor(resumeRepository: ResumeRepository) {
    this.resumeRepository = resumeRepository;
  }

  async execute(): Promise<Resume> {
    return this.resumeRepository.getResumeData();
  }
}
