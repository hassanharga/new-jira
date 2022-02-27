import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss'],
})
export class ImagePreviewComponent implements OnInit {
  @Input() imgSrc!: string;
  @Input() preview!: boolean;

  constructor() {}

  ngOnInit(): void {}
}
