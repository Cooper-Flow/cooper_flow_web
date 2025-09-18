import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DateTime } from '@app/resources/handlers/datetime';
import { Regex } from '@app/resources/handlers/regex';
import { DialogService } from '@app/services/common/dialog.service';
import { ImagesService } from '@app/services/common/images.service';
import { NavigationService } from '@app/services/common/navigation.service';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { LocationService } from '@app/services/user/location.service';
import { MaterialService } from '@app/services/user/material.service';
import { PersonService } from '@app/services/user/person.service';
import { RegisterService } from '@app/services/user/register.service';
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
  public step = signal(1);
  public selectedProducer = signal(false);
  public producer: any = {};
  public productList: Array<any> = [];
  public materialList: Array<any> = [];
  public form: FormGroup;
  public locationList: Array<any> = [];
  public finalData: any = {};
  public producerList: Array<any> = [];

  constructor(
    public navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    public dateTime: DateTime,
    public dialog: MatDialog,
    public image: ImagesService,
    private _materialService: MaterialService,
    private _locationService: LocationService,
    private _dialog: DialogService,
    public regex: Regex,
    private _registerService: RegisterService,
    public router: Router,
    private _personService: PersonService,
    public snackService: SnackbarService
  ) {
    this.form = this._formBuilder.group({
      field: [''],
      batch: [''],
      date: [this.dateTime.getDateTime(), [Validators.required]],
      observation: [''],
    })
  }

  ngOnInit(): void {
    this.getMaterial();
    this.getLocations();
    this.getReport();
  }

  get title() {
    return this.navigationService.getName('register');
  }

  get icon() {
    return this.navigationService.getIcon('register');
  }

  public getProducer() {

    const params = {
      search: '',
      page: 1,
      pageSize: 999999999,
      order: 'asc',
      isProducer: true
    }

    this._personService.paginate(params).subscribe(
      data => {
        this.producerList = data.data;
      }
    )
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
        }
      }
    )
  }

  public dialogProduct() {
    const dialogRef = this.dialog.open(SelectorProductComponent);

    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          const sizes = response?.ProductSize;
          const types = response?.ProductType;

          const volumes = [
            {
              size: sizes[0]?.name,
              type: types[0]?.name,
              weight: 0,
              amount: 0,
              material: {
                volume: false,
              },
              location: null,
              subtract_material: false
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
      weight: 0,
      amount: 0,
      material: {
        volume: false,
      },
      location: null,
      subtract_material: false
    }

    this.productList[index].volumes.push(volume)
  }

  public getMaterial() {

    this._materialService.combolist().subscribe(
      data => {
        this.materialList = data
      },
    )
  }

  public getTotalVolume(volume: volumeProps) {
    try {
      const total = `${volume.amount} x ${volume.material?.volume ? volume.material?.volume : '0'} kg = ${volume.amount * volume.material?.volume} Kg`
      return total
    }
    catch (error) {
      return 'Erro ao calcular total'
    }
  }

  public revision() {

    if (this.form.invalid) {
      this.showError.set(true)
      return
    }
    const data = this.form.value;

    //Verifica se tem produtor selecionado
    if (this.selectedProducer() === false) {
      this.snackService.open('Selecione o produtor')
      return
    }

    data.producer = this.producer;

    //Verifica se a lista de produtos não está vazia
    if (this.productList.length === 0) {
      this.snackService.open('Entrada sem produtos')
      return
    }

    let error: string | boolean = false;
    const products = this.productList;

    products?.map((prod: any) => {
      prod?.volumes?.map((volume: any) => {

        //Verifica se cada produto tem material definido
        if ([null, false, '', undefined].includes(volume?.material?.volume)) {
          error = 'Material não definido'
        }

        //Verifica se  cada produto tem palete definido
        if ([null, false, '', undefined].includes(volume?.location)) {
          error = 'Palete do volume não definido'
        }

        //Verifica se cada produto tem peso válido
        if (volume?.weight === 0) {
          error = 'Peso não pode ser zero'
        }

        //Verifica se cada produto tem peso válido
        if (volume?.weight < 0) {
          error = 'Peso não pode ser nagativo'
        }

        //Verifica se cada produto tem tamanho definido
        if ([null, false, '', undefined].includes(volume?.size)) {
          error = 'Volume não definido'
        }

        //Verifica se cada produto tem tipo definido
        if ([null, false, '', undefined].includes(volume?.type)) {
          error = 'Tipo não definido'
        }
      })

      //Verifica se cada produto tem volume definido
      if (prod?.volumes?.length === 0) {
        error = 'Sem volumes adicionados'
      }
    })

    if (error) {
      this.snackService.open(String(error));
      return
    }

    data.products = products;

    this.finalData = data;

    this.step.set(2)

  }

  public getLocations() {

    this._locationService.combolist().subscribe(
      data => {
        this.locationList = data
      }
    )
  }

  public createEntry() {

    this.isLoading.set(true);

    const data = this.finalData;

    data.entry_at = new Date(data.date).toISOString();

    this._registerService.createEntry(data).subscribe(
      response => {
        this.snackService.open(response.message)
        this.router.navigate(['/track'])
      },
      excp => {
        this.snackService.open(excp.error.message);
        this.isLoading.set(false);
      }
    )
  }
}
