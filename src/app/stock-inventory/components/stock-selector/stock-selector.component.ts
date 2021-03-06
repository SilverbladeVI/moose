import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Product } from '../../models/product.interface';

@Component({
  selector: 'stock-selector',
  template: `
    <div class="stock-selector" [formGroup]="parent">
      <div formGroupName="selector">
        <select formControlName="product_id">
          <option value="">Select Stock</option>
          <option
            *ngFor="let product of products"
            [value]="product.id">
              {{ product.name }}
            </option>
        </select>
        <input
          type="number"
          step="10"
          min="10"
          max="1000"
          formControlName="quantity">
          <button
            type="button"
            (click)="onAdd()"
          >
            Add Stock
          </button>
      </div>
    </div>
  `
})

export class StockSelectorComponent {

  @Input()
  parent: FormGroup;

  @Input()
  products: Product[]

  @Output()
  added = new EventEmitter<any>();

  onAdd(){
    this.added.emit(this.parent.get('selector').value);
  }


}
