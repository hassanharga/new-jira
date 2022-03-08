import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

const CMD_KEY = '/';

@Component({
  selector: 'app-edit-block',
  templateUrl: './edit-block.component.html',
  styleUrls: ['./edit-block.component.scss'],
})
export class EditBlockComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  @Input() tag!: string;
  @Input() html!: string;

  @Output() updateBlockHandler = new EventEmitter();
  @Output() addBlockHandler = new EventEmitter();
  @Output() deleteBlockHandler = new EventEmitter();

  previousKey = '';
  htmlBackup = '';
  selectMenuIsOpen = false;
  formElement = new FormControl('');
  sub!: Subscription;

  constructor() {}

  selectTag(tag: string) {
    console.log('tag', tag);
    this.tag = tag;
    // this.formElement.setValue(this.htmlBackup);
    this.closeMenu();
    this.updateBlockHandler.emit({
      id: this.id,
      html: this.html,
      tag: this.tag,
    });
  }

  closeMenu() {
    this.htmlBackup = '';
    this.selectMenuIsOpen = false;
  }

  onKeyDownHandler(e: any) {
    if (e.key === CMD_KEY) {
      // If the user starts to enter a command, we store a backup copy of
      // the html. We need this to restore a clean version of the content
      // after the content type selection was finished.
      this.htmlBackup = this.html;
      this.selectMenuIsOpen = true;
    }
    if (e.key === 'Enter') {
      // While pressing "Enter" should add a new block to the page, we
      // still want to allow line breaks by pressing "Shift-Enter"
      if (this.previousKey !== 'Shift' && !this.selectMenuIsOpen) {
        e.preventDefault();
        this.addBlockHandler.emit({
          id: this.id,
        });
      }
    }
    if (e.key === 'Backspace' && !this.html) {
      // If there is no content, we delete the block by pressing "Backspace",
      // just as we would remove a line in a regular text container
      e.preventDefault();
      this.deleteBlockHandler.emit({
        id: this.id,
      });
    }
    // Store the key to detect combinations like "Shift-Enter" later on
    this.previousKey = e.key;
  }

  onBlurHandler() {
    this.updateBlockHandler.emit({
      id: this.id,
      html: this.html,
      tag: this.tag,
    });
  }

  ngOnInit(): void {
    this.formElement.setValue(this.html);
    this.sub = this.formElement.valueChanges.subscribe((val) => {
      // value = value.replace(/^[\n\s]+/, '').replace(/[\n\s]+$/, '');
      this.html = val;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
