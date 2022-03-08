import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { matchSorter } from 'match-sorter';

const MENU_HEIGHT = 150;
const allowedTags = [
  {
    id: 'page-title',
    tag: 'h1',
    label: 'Page Title',
  },
  {
    id: 'heading',
    tag: 'h2',
    label: 'Heading',
  },
  {
    id: 'subheading',
    tag: 'h3',
    label: 'Subheading',
  },
  {
    id: 'paragraph',
    tag: 'p',
    label: 'Paragraph',
  },
];

@Component({
  selector: 'app-select-menu',
  templateUrl: './select-menu.component.html',
  styleUrls: ['./select-menu.component.scss'],
})
export class SelectMenuComponent implements OnInit, OnDestroy {
  @Output() selectItem = new EventEmitter();
  @Output() closeMenu = new EventEmitter();

  command = '';
  items = [...allowedTags];
  selectedItem = 0;

  constructor() {}

  selectOption(tag: string, index: number) {
    this.selectedItem = index;
    this.selectItem.emit(tag);
  }

  @HostListener('keydown', ['$event'])
  keyDownHandler(e: any) {
    console.log('key', e.key);
    const items = this.items;
    const selected = this.selectedItem;
    const command = this.command;
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        this.selectItem.emit(items[selected].tag);
        break;
      case 'Backspace':
        if (!command) this.closeMenu.emit();
        this.command = command.substring(0, command.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevSelected = selected === 0 ? items.length - 1 : selected - 1;
        this.selectedItem = prevSelected;
        break;
      case 'ArrowDown':
      case 'Tab':
        e.preventDefault();
        const nextSelected = selected === items.length - 1 ? 0 : selected + 1;
        this.selectedItem = nextSelected;
        break;
      default:
        this.command = this.command + e.key;
        break;
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
