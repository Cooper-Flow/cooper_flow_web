import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '@app/services/common/dialog.service';
import { NavigationService } from '@app/services/common/navigation.service';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { ProductService } from '@app/services/user/product.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {

  public isLoading = signal(false);
  public isEditing = signal(false);
  public showError = signal(false);
  public form: FormGroup
  public product_id = signal('');
  public typesList: Array<any> = [];
  public sizesList: Array<any> = [];

  constructor(
    public navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    public dialogService: DialogService,
    private _productService: ProductService,
    private _router: Router,
    private _snackService: SnackbarService,
    private _activeRoute: ActivatedRoute
  ) {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required]],
      color: ['#3A5C2C', [Validators.required]],
      isActive: [true, [Validators.required]],
    })
  }

  ngOnInit(): void {
    const producer_id = this._activeRoute.snapshot.params['id'];

    if (producer_id) {
      this.isEditing.set(true);
      this.product_id.set(producer_id)
      this.detail(producer_id);
    }
  }


  get icon() {
    return this.navigationService.getIcon('products');
  }

  get type() {
    return this.form.get(['type'])?.value;
  }

  get phoneLength() {
    const value = this.form.get(['phone'])?.value;

    if(value?.length < 11) {
      return '(00) 0000-00000'
    } else {
      return '(00) 00000-0000'
    }
  }

  public detail(id: string) {
    this.isLoading.set(true);

    this._productService.detail(id).subscribe(
      data => {
        this.form.patchValue(data);
        this.typesList = data?.ProductType;
        this.sizesList = data?.ProductSize;
        this.isLoading.set(false);
      },
      error => {
        this.isLoading.set(false);
        this._snackService.open(error.error.message)
      }
    )
  }

  public create() {

    if (this.form.invalid) {
      this.showError.set(true)
      return
    }

    this.typesList?.map(t => {
      if(t.name === '' || t.name === null) {
        this.showError.set(true)
      }
    })

    this.sizesList?.map(s => {
      if(s.name === '' || s.name === null) {
        this.showError.set(true)
      }
    })

    if(this.showError() ===  true) {
      return
    }

    const data = this.form.value;

    data.phone = String(data.phone)

    data.types = this.typesList;
    data.sizes = this.sizesList;

    this.isLoading.set(true);

    let observable: Observable<any>;

    if (this.isEditing()) {
      data.id = this.product_id();
      observable = this._productService.update(data);
    } else {
      observable = this._productService.create(data);
    }

    observable.subscribe(
      response => {
        this._snackService.open(response.message);
        this._router.navigate([this.navigationService.getPATH('products')]);
      },
      error => {
        this.isLoading.set(false);
        this._snackService.open(error.error.message)
      }
    )
  }

  public addType() {

    const data = {
      name: '',
      isActive: true
    }

    this.typesList.push(data);
  }

  public addSize() {

    const data = {
      name: '',
      isActive: true
    }

    this.sizesList.push(data);
  }

  public deleteType(index: number) {
    this.typesList.splice(index, 1);
  }

  public deleteSize(index: number) {
    this.sizesList.splice(index, 1);
  }
}
