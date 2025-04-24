import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DualListItem } from './dual-list-item.interface';

@Component({
  selector: 'app-dual-list-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dual-list-box.component.html',
  styleUrls: ['./dual-list-box.component.scss']
})
export class DualListBoxComponent implements OnInit {
  @Input() sourceItems: DualListItem[] = [];
  @Input() targetItems: DualListItem[] = [];
  @Input() sourceTitle = 'Available Items';
  @Input() targetTitle = 'Selected Items';
  @Input() itemTemplate?: TemplateRef<any>;
  @Input() disabled = false;
  @Input() showSearch = true;
  @Input() key = 'id';
  @Input() display = 'name';

  @Output() sourceChange = new EventEmitter<DualListItem[]>();
  @Output() targetChange = new EventEmitter<DualListItem[]>();

  filteredSourceItems: DualListItem[] = [];
  filteredTargetItems: DualListItem[] = [];
  
  sourceSelectedItems: DualListItem[] = [];
  targetSelectedItems: DualListItem[] = [];
  
  sourceSearchText = '';
  targetSearchText = '';

  draggedItem: DualListItem | null = null;

  ngOnInit(): void {
    this.filteredSourceItems = [...this.sourceItems];
    this.filteredTargetItems = [...this.targetItems];
  }

  // Drag and Drop handlers
  onDragStart(event: DragEvent, item: DualListItem): void {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    this.draggedItem = item;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', item[this.key]);
    }
  }

  onDragOver(event: DragEvent, target: 'source' | 'target'): void {
    if (this.disabled || !this.draggedItem) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, target: 'source' | 'target'): void {
    event.preventDefault();
    if (this.disabled || !this.draggedItem) return;

    const sourceList = target === 'source' ? this.targetItems : this.sourceItems;
    const targetList = target === 'source' ? this.sourceItems : this.targetItems;

    if (
      (target === 'source' && this.sourceItems.some(item => item[this.key] === this.draggedItem![this.key])) ||
      (target === 'target' && this.targetItems.some(item => item[this.key] === this.draggedItem![this.key]))
    ) {
      this.draggedItem = null;
      return;
    }

    const newSourceList = sourceList.filter(item => item[this.key] !== this.draggedItem![this.key]);
    const newTargetList = [...targetList, this.draggedItem!];

    if (target === 'source') {
      this.sourceItems = newTargetList;
      this.targetItems = newSourceList;
      this.sourceChange.emit(this.sourceItems);
      this.targetChange.emit(this.targetItems);
    } else {
      this.sourceItems = newSourceList;
      this.targetItems = newTargetList;
      this.sourceChange.emit(this.sourceItems);
      this.targetChange.emit(this.targetItems);
    }

    this.filterSourceItems();
    this.filterTargetItems();
    this.draggedItem = null;
  }

  onDragEnd(): void {
    this.draggedItem = null;
  }

  // Selection methods
  toggleSourceSelection(item: DualListItem, event: MouseEvent): void {
    if (this.disabled) return;
    
    if (!event.ctrlKey && !event.metaKey) {
      this.sourceSelectedItems = [item];
    } else {
      const index = this.sourceSelectedItems.findIndex(i => i[this.key] === item[this.key]);
      if (index === -1) {
        this.sourceSelectedItems = [...this.sourceSelectedItems, item];
      } else {
        this.sourceSelectedItems = this.sourceSelectedItems.filter(i => i[this.key] !== item[this.key]);
      }
    }
  }

  toggleTargetSelection(item: DualListItem, event: MouseEvent): void {
    if (this.disabled) return;
    
    if (!event.ctrlKey && !event.metaKey) {
      this.targetSelectedItems = [item];
    } else {
      const index = this.targetSelectedItems.findIndex(i => i[this.key] === item[this.key]);
      if (index === -1) {
        this.targetSelectedItems = [...this.targetSelectedItems, item];
      } else {
        this.targetSelectedItems = this.targetSelectedItems.filter(i => i[this.key] !== item[this.key]);
      }
    }
  }

  isSourceItemSelected(item: DualListItem): boolean {
    return this.sourceSelectedItems.some(i => i[this.key] === item[this.key]);
  }

  isTargetItemSelected(item: DualListItem): boolean {
    return this.targetSelectedItems.some(i => i[this.key] === item[this.key]);
  }

  isDragged(item: DualListItem): boolean {
    return this.draggedItem ? this.draggedItem[this.key] === item[this.key] : false;
  }

  // Move actions
  moveToTarget(): void {
    if (this.disabled || this.sourceSelectedItems.length === 0) return;
    
    const newSourceItems = this.sourceItems.filter(item => 
      !this.sourceSelectedItems.some(selected => selected[this.key] === item[this.key])
    );
    
    const newTargetItems = [...this.targetItems, ...this.sourceSelectedItems];
    
    this.sourceItems = newSourceItems;
    this.targetItems = newTargetItems;
    this.sourceSelectedItems = [];
    
    this.filterSourceItems();
    this.filterTargetItems();
    
    this.sourceChange.emit(this.sourceItems);
    this.targetChange.emit(this.targetItems);
  }

  moveToSource(): void {
    if (this.disabled || this.targetSelectedItems.length === 0) return;
    
    const newTargetItems = this.targetItems.filter(item => 
      !this.targetSelectedItems.some(selected => selected[this.key] === item[this.key])
    );
    
    const newSourceItems = [...this.sourceItems, ...this.targetSelectedItems];
    
    this.targetItems = newTargetItems;
    this.sourceItems = newSourceItems;
    this.targetSelectedItems = [];
    
    this.filterSourceItems();
    this.filterTargetItems();
    
    this.sourceChange.emit(this.sourceItems);
    this.targetChange.emit(this.targetItems);
  }

  moveAllToTarget(): void {
    if (this.disabled || this.filteredSourceItems.length === 0) return;
    
    const itemsToMove = [...this.filteredSourceItems];
    const newSourceItems = this.sourceItems.filter(item => 
      !itemsToMove.some(moveItem => moveItem[this.key] === item[this.key])
    );
    
    const newTargetItems = [...this.targetItems, ...itemsToMove];
    
    this.sourceItems = newSourceItems;
    this.targetItems = newTargetItems;
    this.sourceSelectedItems = [];
    
    this.filterSourceItems();
    this.filterTargetItems();
    
    this.sourceChange.emit(this.sourceItems);
    this.targetChange.emit(this.targetItems);
  }

  moveAllToSource(): void {
    if (this.disabled || this.filteredTargetItems.length === 0) return;
    
    const itemsToMove = [...this.filteredTargetItems];
    const newTargetItems = this.targetItems.filter(item => 
      !itemsToMove.some(moveItem => moveItem[this.key] === item[this.key])
    );
    
    const newSourceItems = [...this.sourceItems, ...itemsToMove];
    
    this.targetItems = newTargetItems;
    this.sourceItems = newSourceItems;
    this.targetSelectedItems = [];
    
    this.filterSourceItems();
    this.filterTargetItems();
    
    this.sourceChange.emit(this.sourceItems);
    this.targetChange.emit(this.targetItems);
  }

  // Search/filter methods
  filterSourceItems(): void {
    if (this.sourceSearchText.trim() === '') {
      this.filteredSourceItems = [...this.sourceItems];
    } else {
      const searchText = this.sourceSearchText.toLowerCase();
      this.filteredSourceItems = this.sourceItems.filter(item => 
        String(item[this.display]).toLowerCase().includes(searchText)
      );
    }
  }

  filterTargetItems(): void {
    if (this.targetSearchText.trim() === '') {
      this.filteredTargetItems = [...this.targetItems];
    } else {
      const searchText = this.targetSearchText.toLowerCase();
      this.filteredTargetItems = this.targetItems.filter(item => 
        String(item[this.display]).toLowerCase().includes(searchText)
      );
    }
  }

  onSourceSearchChange(): void {
    this.filterSourceItems();
  }

  onTargetSearchChange(): void {
    this.filterTargetItems();
  }

  clearSourceSearch(): void {
    this.sourceSearchText = '';
    this.filterSourceItems();
  }

  clearTargetSearch(): void {
    this.targetSearchText = '';
    this.filterTargetItems();
  }

  // Utility methods
  trackByFn(index: number, item: DualListItem): any {
    return item[this.key];
  }
}