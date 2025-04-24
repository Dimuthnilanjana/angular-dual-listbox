import { Component } from '@angular/core';
import { DualListBoxComponent } from '../dual-list-box/dual-list-box.component';
import { DualListItem } from '../dual-list-box/dual-list-item.interface';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [DualListBoxComponent],
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent {
  // Sample data for demonstration
  sourceItems: DualListItem[] = [
    { id: 1, name: 'Apple', category: 'Fruits' },
    { id: 2, name: 'Banana', category: 'Fruits' },
    { id: 3, name: 'Orange', category: 'Fruits' },
    { id: 4, name: 'Strawberry', category: 'Berries' },
    { id: 5, name: 'Blueberry', category: 'Berries' },
    { id: 6, name: 'Carrot', category: 'Vegetables' },
    { id: 7, name: 'Broccoli', category: 'Vegetables' },
    { id: 8, name: 'Cucumber', category: 'Vegetables' },
    { id: 9, name: 'Potato', category: 'Vegetables' },
    { id: 10, name: 'Tomato', category: 'Vegetables' },
    { id: 11, name: 'Onion', category: 'Vegetables' },
    { id: 12, name: 'Lettuce', category: 'Vegetables' },
    { id: 13, name: 'Spinach', category: 'Vegetables' },
  ];
  
  targetItems: DualListItem[] = [];

  onSourceChange(items: DualListItem[]): void {
    this.sourceItems = items;
    console.log('Source items updated:', items);
  }

  onTargetChange(items: DualListItem[]): void {
    this.targetItems = items;
    console.log('Target items updated:', items);
  }
}