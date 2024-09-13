import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mod } from '../data/mod.model';

@Component({
  selector: 'app-added-items',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './added-items.component.html',
  styleUrl: './added-items.component.css'
})
export class AddedItemsComponent {
  @Input() items: Mod[] = [];
  @Output() deleteItem = new EventEmitter<string>();

  removeItem(name: string) {
    this.deleteItem.emit(name);
  }
}
