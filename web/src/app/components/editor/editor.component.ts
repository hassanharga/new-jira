import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { QuillEditorComponent, QuillModules } from 'ngx-quill';
import 'quill-mention';

import { EMPTY, lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { IssueService } from 'src/app/services/issue.service';
import { Issue } from 'src/app/types/issue';
import { User } from 'src/app/types/user';
import { parseToHtml } from 'src/app/utils/excapeHtml';

// import 'quill-emoji/dist/quill-emoji.js';
// import Quill from 'quill'
// import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
// Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  @Input() isComment = false;
  @Input() placeholder = '';
  @Input() initDescription = '';
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
      source: async (searchTerm: any, renderList: any, mentionChar: any) => {
        let values: any[] = [];

        if (mentionChar === '@') {
          const data = (await lastValueFrom(this.searchUsers(searchTerm))) || [];
          values = this.mapUsers(data);
        } else {
          const data = (await lastValueFrom(this.searchIssues(searchTerm))) || [];
          values = this.mapIssues(data);
        }

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches: any[] = [];

          values.forEach((entry) => {
            if (entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
              matches.push(entry);
            }
          });
          renderList(matches, searchTerm);
        }
      },
    },
    // 'emoji-shortname': true,
    // 'emoji-textarea': false,
    // 'emoji-toolbar': true,
    // blotFormatter: {
    //   // empty object for default behaviour.
    // },
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction
        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],
        ['clean'], // remove formatting button
        ['link'], // link and image, video
      ],
      // handlers: { 'emoji': function () { } },
    },
  };

  constructor(private api: ApiService, private issueService: IssueService) {}

  private mapUsers(users: User[]) {
    return users.map((ele) => ({ ...ele, value: ele.name, link: `/users?user=${ele._id}` }));
  }

  private mapIssues(issues: Issue[]) {
    return issues.map((ele) => ({ ...ele, value: ele.name, link: `/issues?issue=${ele._id}` }));
  }

  changeDescripton() {
    this.handleDescription.emit(this.description);
  }

  private searchUsers(value?: string) {
    const options: Record<string, any> = {};
    if (value) options['search'] = value;
    return this.api.send<User[]>('getUsers', options);
  }

  private searchIssues(value?: string) {
    const boardId = this.issueService.boardId;
    if (!boardId) return EMPTY;
    const options: Record<string, any> = { id: boardId };
    if (value) options['search'] = value;
    return this.api.send<Issue[]>('getBoardIssues', options);
  }

  ngOnInit(): void {
    if (this.initDescription) {
      this.description = parseToHtml(this.initDescription);
    }
  }
}
