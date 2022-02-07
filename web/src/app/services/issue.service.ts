import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Board } from '../types/board';
import { Project } from '../types/project';

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  private project = new BehaviorSubject<Project | null>(null);
  private projectId = new BehaviorSubject<string>('');

  private board = new BehaviorSubject<Board | null>(null);

  constructor() {}

  setProject(project: Project) {
    this.project.next(project);
    this.projectId.next(project?._id);
  }

  setBoard(board: Board) {
    this.board.next(board);
  }

  setProjectId(id: string) {
    this.projectId.next(id);
  }

  geProject() {
    return this.project.asObservable();
  }

  getBoard() {
    return this.board.asObservable();
  }

  getProjectId() {
    return this.projectId.asObservable();
  }
}
