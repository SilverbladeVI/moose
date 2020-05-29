import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { StockInventoryService } from '../../services/stock-inventory.service';

import { Product, Item } from '../../models/product.interface';

@Component({
  selector: 'stock-inventory',
  styleUrls: ['stock-inventory.component.scss'],
  template:  `
    <div class="stock-inventory">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">

        <stock-branch [parent]="form"></stock-branch>

        <stock-selector [parent]="form" [products]="products" (added)="addStock($event)"></stock-selector>

        <stock-products
        [parent]="form"
        (removed)="removeStock($event)"
        ></stock-products>

        <div class="stock-inventory__buttons">
          <button
            type="submit"
            [disabled]="form.invalid"
          >
            Order Stock
          </button>
        </div>

        <pre>{{ form.value | json}}</pre>

      </form>
    </div>
  `
})

export class StockInventoryComponent implements OnInit {

  products: Product[];

  form = this.fb.group({
    store: this.fb.group({
      branch: '',
      code: ''
    }),
    selector: this.createStock({}),
    stock: this.fb.array([])
  })

  constructor(
    private fb: FormBuilder,
    private stockService: StockInventoryService
  ) {}

  ngOnInit(){
    const cart = this.stockService.getCartItems();
    const products = this.stockService.getProducts();

    //Merge Data Sources
    Observable
      .forkJoin(cart, products)
      .subscribe(data => console.log(data));

  }

  createStock(stock){
    return this.fb.group({
      product_id: parseInt(stock.product_id, 10) || '',
      quantity: parseInt(stock.quantity, 10) || 10
    })
  }

  addStock(stock){
    const control = this.form.get('stock') as FormArray;
    control.push(this.createStock(stock));
  }

  removeStock({group, index} : {group: FormGroup, index: number}) {
    const control = this.form.get('stock') as FormArray;
    control.removeAt(index)
  }

  onSubmit(){
    console.log('Submit:', this.form.value );
  }

}
