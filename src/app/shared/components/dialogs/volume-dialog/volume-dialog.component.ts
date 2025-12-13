import { Component, inject, model, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Calc } from '@app/resources/handlers/calc';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { LocationService } from '@app/services/user/location.service';
import { MaterialService } from '@app/services/user/material.service';
import { ProductService } from '@app/services/user/product.service';
import { VolumeService } from '@app/services/user/volume.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-volume-dialog',
  templateUrl: './volume-dialog.component.html',
  styleUrl: './volume-dialog.component.scss'
})
export class VolumeDialogComponent implements OnInit {

  public isEditing = signal(false);
  public isLoading = signal(true);
  public isSaving = signal(false);
  public volume_id = signal('');
  public sizeList: Array<any> = [];
  public typeList: Array<any> = [];
  public loadingPoint = signal(0);
  public locationList: Array<any> = [];
  public materialList: Array<any> = [];
  public productList: Array<any> = [];
  public isLoadingProduct = signal(false);
  public showProductTypes = signal(false);
  public form: FormGroup
  public selectedEntry: number = 0;

  readonly dialogRef = inject(MatDialogRef<VolumeDialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);

  constructor(
    private _volumeService: VolumeService,
    public snackService: SnackbarService,
    public router: Router,
    private _locationService: LocationService,
    private _materialService: MaterialService,
    public calc: Calc,
    private _productService: ProductService,
    private _formBuilder: FormBuilder,
  ) {
    this.form = this._formBuilder.group({
      product_id: ['', [Validators.required]],
      product_type: ['', [Validators.required]],
      product_size: ['', [Validators.required]],
      weight: ['',
        [
          Validators.required,
          Validators.min(0.01),
        ]
      ],
      material_id: ['', [Validators.required]],
      location_id: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getMaterial();
    this.getLocation();
    const volume_id = this.data.volume_id;
    this.getProduct();
    this.selectedEntry = this.data.entry_id;

    if (volume_id) {

      this.getVolume(volume_id)
    } else {
      this.loadingPoint.set(4);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public getVolume(id: string) {
    this.isEditing.set(true)
    this.showProductTypes.set(true)
    this.volume_id.set(id);
    this._volumeService.detail(id).subscribe(
      data => {
        if (data?.exited || data?.Location === null) {
          this.router.navigate(['/in/track']);
          this.snackService.open('Este volume não existe mais')
        } else {
          this.form.patchValue({
            product_id: data.product_id,
            product_type: data.type,
            product_size: data.size,
            weight: data.weight,
            material_id: data.material_id,
            location_id: data.location_id
          });
          this.getProductDetail(data.product_id)
          this.loadingPoint.update(value => value + 1);
        }
      },
      excp => {
        this.snackService.open(excp.error.message)
        this.router.navigate(['/in/track'])
      }
    )
  }

  public getLocation() {

    this._locationService.combolist().subscribe(
      data => {
        this.locationList = data;
        this.loadingPoint.update(value => value + 1);
      }
    )
  }

  public getMaterial() {

    this._materialService.combolist().subscribe(
      data => {
        this.materialList = data;
        this.loadingPoint.update(value => value + 1);
      },
    )
  }

  public getProduct() {

    const params = {
      search: '',
      page: 1,
      pageSize: 9999999,
      order: 'asc'
    }

    this._productService.paginate(params).subscribe(
      data => {
        this.productList = data.data;
        this.loadingPoint.update(value => value + 1);
      }
    )
  }

  public getUnits(): number | string {

    const weight = this.form.get('weight')?.value;
    const material_id = this.form.get('material_id')?.value;

    if (!weight || !material_id) {
      return '';
    }

    const material = this.materialList.find(m => m.id === material_id);
    if (!material || !material.volume) {
      return '';
    }

    const unitWeight = Number(material.volume);

    if (!weight || !unitWeight) return '';

    return this.calc.calcTotalUnits({ volume: unitWeight, weight: weight })
  }

  public setProduct(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.form.patchValue({
    product_type: null,
    product_size: null,
  });
    this.getProductDetail(value)
  }

  public getProductDetail(id: string) {
    this.isLoadingProduct.set(true);

    this._productService.detail(id).subscribe(
      data => {
        this.sizeList = data.ProductSize;
        this.typeList = data.ProductType;
        this.showProductTypes.set(true);
        this.isLoadingProduct.set(false);
      }
    )
  }

  public submit() {

    if (this.isSaving()) return;

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return
    }

    const formData = this.form.value;
    formData.entry_id = this.selectedEntry;
    formData.isStash = false;
    this.isSaving.set(true);

    let observable: Observable<any>;

    if(this.isEditing()) {
      formData.id = this.volume_id();
      observable = this._volumeService.update(formData);
    }
    else {
      observable = this._volumeService.create(formData);
    }

    observable.subscribe(
      response => {
        this.dialogRef.close();
        this.snackService.open(response.message);
      },
      excp => {
        this.isSaving.set(false);
        this.snackService.open('Houve um erro inesperado ao criar volume');
      }
    )
  }


}
