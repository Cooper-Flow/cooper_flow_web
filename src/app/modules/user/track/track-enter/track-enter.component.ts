import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DateTime } from '@app/resources/handlers/datetime';
import { ImagesService } from '@app/services/common/images.service';
import { NavigationService } from '@app/services/common/navigation.service';
import { MaterialService } from '@app/services/user/material.service';
import { SelectorProducerComponent } from '@app/shared/components/selector-producer/selector-producer.component';
import { SelectorProductComponent } from '@app/shared/components/selector-product/selector-product.component';

interface volumeProps {
  amount: number
  material: any
  size: string
  type: string
}

@Component({
  selector: 'app-track-enter',
  templateUrl: './track-enter.component.html',
  styleUrl: './track-enter.component.scss'
})
export class TrackEnterComponent implements OnInit {

  public isLoading = signal(true);
  public showError = signal(false);
  public selectedProducer = signal(false);
  public producer: any = {};
  public productList: Array<any> = [];
  public materialList: Array<any> = [];
  public form: FormGroup;

  constructor(
    public navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    public dateTime: DateTime,
    public dialog: MatDialog,
    public image: ImagesService,
    private _materialService: MaterialService
  ) {
    this.form = this._formBuilder.group({
      field: ['', [Validators.required]],
      date: [this.dateTime.getDateTime(), [Validators.required]],
      observation: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getMaterial();
    this.getReport();
  }

  get title() {
    return this.navigationService.getName('register');
  }

  get icon() {
    return this.navigationService.getIcon('register');
  }

  public getReport() {
    this.isLoading.set(false);
  }

  public dialogProducer() {
    const dialogRef = this.dialog.open(SelectorProducerComponent);

    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          this.selectedProducer.set(true)
          this.producer = response
          console.log(response)
        }
      }
    )
  }

  public dialogProduct() {
    const dialogRef = this.dialog.open(SelectorProductComponent);

    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          console.log(response)
          
          const sizes = response?.ProductSize;
          const types = response?.ProductType;

          const volumes = [
            {
              size: sizes[0]?.name,
              type: types[0]?.name,
              amount: 0,
              material: {
                volume: false,
                volume_type: ''
              }
            }
          ]

          response.volumes = volumes;
          this.productList.push(response)
        }
      }
    )
  }

  public deleteProduct(index: number) {

    this.productList.splice(index, 1);
  }

  public addVolume(prod: any, index: number) {

    const volume = {
      size: prod.ProductSize[0]?.name,
      type: prod.ProductType[0]?.name,
      amount: 0,
      material: {
        volume: false,
        volume_type: ''
      }
    }

    this.productList[index].volumes.push(volume)
  }

  public getMaterial() {

    const params = {
      search: '',
      page: 1,
      pageSize: 99999999,
      traceable: true
    }

    this._materialService.paginate(params).subscribe(
      data => {
        this.materialList = data?.data
      },
    )
  }

  public getTotalVolume(volume: volumeProps) {
    try {
      const total = `${volume.amount} x ${volume.material?.volume ? volume.material?.volume : '0'} ${volume.material?.volume_type} = ${volume.amount * volume.material?.volume} ${volume.material?.volume_type}`
      return total
    }
    catch (error) {
      return 'Erro ao calcular total'
    }
  }

  public revision() {

    const data = this.form.value;
    data.products = this.productList;

    console.log(data)


    if (this.form.invalid) {
      this.showError.set(true)
      return
    }



  }
}
