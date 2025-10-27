import { Component, OnInit, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Regex } from '@app/resources/handlers/regex';
import { NavigationService } from '@app/services/common/navigation.service';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { CustomerService } from '@app/services/user/customer.service';
import { ProductService } from '@app/services/user/product.service';

interface props {

}


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {

  public isLoading = signal(true);
  displayedColumns: string[] = ['color','name', 'status', 'created_at', 'action',];
  public productList: Array<props> = [];
  public productTotal: number = 0;
  public page_size: number = 10;
  public page_index: number = 0;
  public order: string = 'asc';

  constructor(
    public navigationService: NavigationService,
    private _productService: ProductService,
    private _snackbarService: SnackbarService,
    public regex: Regex,
  ) { }


  ngOnInit(): void {
    this.getProducers();
  }

  get title() {
    return this.navigationService.getName('products');
  }

  get icon() {
    return this.navigationService.getIcon('products');
  }

  public filterOrder(event: Event) {
    this.order = (event.target as HTMLInputElement).value;
    this.getProducers();
  }

  public pageEvent(event: PageEvent) {
    this.page_size = event.length;
    this.page_index = event.pageIndex;
    this.page_size = event.pageSize;

    this.getProducers();
  }

  public getProducers() {

    this.isLoading.set(true);

    const params = {
      search: '',
      page: this.page_index + 1,
      pageSize: this.page_size,
      order: this.order
    }

    this._productService.paginate(params).subscribe(
      data => {
        this.productList = data.data;
        this.productTotal = data.total;
        this.isLoading.set(false);
      },
      error => {
        this._snackbarService.open(error.error.message)
      }
    )
  }

}
