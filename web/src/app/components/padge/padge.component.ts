import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-padge',
  templateUrl: './padge.component.html',
  styleUrls: ['./padge.component.scss'],
})
export class PadgeComponent implements OnInit {
  @Input() label = '';

  constructor() {}

  ngOnInit(): void {}
}
