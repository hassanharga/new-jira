import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'img';

type Block = { html: string; tag: Tag; showMenuItems: boolean };

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  @Output() handleDescription = new EventEmitter<string>();
  currentBlock: Block = { html: '', tag: 'p', showMenuItems: false };

  formElement = new FormControl('');

  menuItems: { name: string; value: Tag; selected: boolean }[] = [
    { name: 'page title', value: 'h1', selected: false },
    { name: 'heading', value: 'h2', selected: false },
    { name: 'sub heading', value: 'h3', selected: false },
    { name: 'paragraph', value: 'p', selected: false },
  ];

  constructor() {}

  onKeyDownHandler(e: KeyboardEvent) {
    const key = e.key;
    if (key === '/') {
      this.currentBlock.showMenuItems = true;
    } else {
      this.currentBlock.showMenuItems = false;
    }
  }

  selectTag(itemTag: Tag, menuIdx: number) {
    this.menuItems = this.menuItems.map((menu, idx) => {
      if (idx == menuIdx) {
        return { ...menu, selected: true };
      }
      return { ...menu, selected: false };
    });
    this.currentBlock.tag = itemTag;
    this.formElement.setValue(this.currentBlock.html);
    this.currentBlock.showMenuItems = false;
  }

  ngOnInit(): void {
    this.formElement.valueChanges.subscribe((val) => {
      console.log('val', val);
      this.currentBlock.html = val;
      const description = `<${this.currentBlock.tag}>${val}</${this.currentBlock.tag}>`;
      this.handleDescription.emit(description);
    });
  }
}
