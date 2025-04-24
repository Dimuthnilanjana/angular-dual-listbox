import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { DemoComponent } from './app/demo/demo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DemoComponent],
  template: `
    <app-demo></app-demo>
  `,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);