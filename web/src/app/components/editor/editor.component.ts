import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { QuillEditorComponent, QuillModules } from 'ngx-quill';
import 'quill-mention';
import { Issue } from 'src/app/types/issue';
import { User } from 'src/app/types/user';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnChanges {
  @Input() issues: Issue[] = [];
  @Input() users: User[] = [];
  @Output() handleDescription = new EventEmitter<string>();

  @ViewChild(QuillEditorComponent, { static: true }) editor!: QuillEditorComponent;

  description = '';

  modules: QuillModules = {
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ['@', '#'],
      onSelect: (item: any, insertItem: any) => {
        const editor = this.editor.quillEditor;
        insertItem(item);
        // necessary because quill-mention triggers changes as 'api' instead of 'user'
        editor.insertText(editor.getLength() - 1, '', 'user');
      },
      source: (searchTerm: any, renderList: any, mentionChar: any) => {
        let values;

        if (mentionChar === '@') {
          values = this.users;
        } else {
          values = this.issues;
        }

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches: any[] = [];

          values.forEach((entry) => {
            if (entry.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
              matches.push(entry);
            }
          });
          renderList(matches, searchTerm);
        }
      },
    },
  };

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['issues'] && changes['issues'].currentValue.length > 0) {
      this.issues = this.issues.map((ele) => ({
        ...ele,
        value: ele.name,
        link: `/projects/${ele.project}/board?issue=${ele._id}`,
      }));
    }
    if (changes && changes['users'] && changes['users'].currentValue.length > 0) {
      this.users = this.users.map((ele) => ({ ...ele, value: ele.name, link: `/users?user=${ele._id}` }));
    }
  }

  changeDescripton() {
    this.handleDescription.emit(this.description);
  }

  ngOnInit(): void {}
}
