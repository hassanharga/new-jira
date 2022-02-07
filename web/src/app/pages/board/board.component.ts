import { Component, OnInit } from '@angular/core';
import { IssueService } from 'src/app/services/issue.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  constructor(private issueService: IssueService) {}

  ngOnInit(): void {}
}
