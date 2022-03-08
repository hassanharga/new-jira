import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Board } from '../types/board';
import { Issue } from '../types/issue';
import { Project } from '../types/project';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root',
})
export class IssueService {
  private project = new BehaviorSubject<Project | null>(null);
  private projectId = new BehaviorSubject<string>('');

  private board = new BehaviorSubject<Board | null>(null);

  private users = new BehaviorSubject<User[]>([]);
  private issues = new BehaviorSubject<Issue[]>([]);

  constructor() {}

  setIssues(issues: Issue[]) {
    this.issues.next(issues);
  }

  setUsers(users: User[]) {
    this.users.next(users);
  }

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

  getUsers() {
    return this.users.asObservable();
  }

  getIssues() {
    return this.issues.asObservable();
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
