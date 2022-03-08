import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { uid } from 'src/app/utils/uid';

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'img';

type Block = { id: string; html: string; tag: Tag };

const initialBlock = { id: uid(), html: '', tag: 'p' };

@Component({
  selector: 'app-new-editor',
  templateUrl: './new-editor.component.html',
  styleUrls: ['./new-editor.component.scss'],
})
export class NewEditorComponent implements OnInit {
  @Output() submitBlocks = new EventEmitter();

  blocks = [initialBlock];

  constructor() {}

  addBlockHandler(currentBlock: Block) {
    const newBlock: Block = { id: uid(), html: '', tag: 'p' };
    const updatedBlocks = [...this.blocks];
    const blockIdx = updatedBlocks.findIndex((ele) => ele.id === currentBlock.id);
    updatedBlocks.splice(blockIdx + 1, 0, newBlock);
    this.blocks = [...updatedBlocks];
  }

  updateBlockHandler(block: Block) {
    console.log('block', block);
    const updatedBlocks = [...this.blocks];
    const blockIdx = updatedBlocks.findIndex((ele) => ele.id === block.id);
    if (blockIdx < 0) return;
    updatedBlocks[blockIdx] = {
      ...updatedBlocks[blockIdx],
      tag: block.tag,
      html: block.html,
    };
    this.blocks = updatedBlocks;
    console.log('this.blocks', this.blocks);
    this.submitBlocks.emit(this.blocks);
  }

  deleteBlockHandler(currentBlock: Block) {
    if (this.blocks.length === 1) return;
    const updatedBlocks = [...this.blocks];
    const blockIdx = updatedBlocks.findIndex((ele) => ele.id === currentBlock.id);
    updatedBlocks.splice(blockIdx, 1);
    this.blocks = [...updatedBlocks];
  }

  ngOnInit(): void {}
}
