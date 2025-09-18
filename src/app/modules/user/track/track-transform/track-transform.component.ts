import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTime } from '@app/resources/handlers/datetime';
import { Regex } from '@app/resources/handlers/regex';
import { DialogService } from '@app/services/common/dialog.service';
import { LoadingService } from '@app/services/common/loading.service';
import { NavigationService } from '@app/services/common/navigation.service';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { LocationService } from '@app/services/user/location.service';
import { MaterialService } from '@app/services/user/material.service';
import { RegisterService } from '@app/services/user/register.service';
import { VolumeService } from '@app/services/user/volume.service';
import { DialogTransformComponent } from '@app/shared/components/dialog-transform/dialog-transform.component';

@Component({
  selector: 'app-track-transform',
  templateUrl: './track-transform.component.html',
  styleUrl: './track-transform.component.scss'
})
export class TrackTransformComponent implements OnInit {

  public isLoading = signal(true);
  public template = signal('movimentation');
  public volumeData: any = {};
  public locationList: Array<any> = [];
  public volumeList: Array<any> = [];
  public materialList: Array<any> = [];
  public exitList: Array<any> = [];
  public sizeList: Array<any> = [];
  public typeList: Array<any> = [];
  public removeWeight: number = 0;
  public loadingPoint = signal(0);

  constructor(
    public navigationService: NavigationService,
    public activeRoute: ActivatedRoute,
    public router: Router,
    private _volumeService: VolumeService,
    public regex: Regex,
    public dateTime: DateTime,
    private _locationService: LocationService,
    private _materialService: MaterialService,
    public snackService: SnackbarService,
    public loadingService: LoadingService,
    public dialogService: DialogService,
    public dialog: MatDialog,
    public _registerService: RegisterService,
  ) { }

  ngOnInit(): void {
    this.getLocation();
    this.getMaterial();
    this.getExits();
    const location_id = this.activeRoute.snapshot.params['id'];

    const template = this.activeRoute.snapshot.queryParams['template'];

    if (template) {
      this.template.set(template)
    }
    else {
      this.template.set('movimentation')
    }


    if (location_id) {
      this.getVolume(location_id)
    }
    else {
      this.router.navigate(['/in/track'])
    }
  }

  get totalVolume() {
    const amount = this.volumeData?.amount;
    const volume = this.volumeData?.volume;

    return amount * volume;
  }

  get totalDrawn() {
    const total = this.totalAmount * this.volumeData.volume;
    return total
  }

  get checkRemove() {
    if (this.removeWeight > this.volumeData.weight) {
      return true
    }
    else {
      return false
    }
  }

  get totalAmount() {

    return this.volumeData?.volume * this.removeWeight
  }

  get notAlocate() {
    let total = 0;

    this.volumeList.map((volume) => {
      const material = this.materialList.find(m => m.id === volume?.material_id)
      total = total + (volume.amount * (volume.single ? volume?.volume : material.volume));
    })

    const result = this.totalAmount - total;

    return result
  }

  get remainingAmount() {
    return this.volumeData.amount - this.regex.getNextNumber(this.totalAmount)
  }

  get remaining() {
    return this.volumeData.weight - this.removeWeight
  }

  get limit() {
    if (this.removeWeight > 0) {
      return false
    } {
      return true
    }
  }

  get checkLimit() {
    const amount_available = this.volumeData?.weight;
    if (amount_available > this.removeWeight) {
      return false
    } else {
      return true
    }
  }

  public addRemove() {
    this.removeWeight++;

    if (this.volumeList.length === 1) {
      this.volumeList[0].weight = this.removeWeight
    }
  }

  public removeRemove() {
    this.removeWeight--;

    if (this.volumeList.length === 1) {
      this.volumeList[0].weight = this.removeWeight
    } else {
      this.volumeList.map(v => {
        v.weight = 0
      })
    }
  }

  public getBackRoute(volume: any) {

    const path = `/in/track/location/detail/${volume?.Location?.id}`;
    return path;
  }

  public getVolume(id: string) {
    this._volumeService.detail(id).subscribe(
      data => {
        this.volumeData = data;
        this.sizeList = data?.Product?.ProductSize;
        this.typeList = data?.Product?.ProductType;

        if (data?.exited || data?.Location === null) {
          this.router.navigate(['/in/track']);
          this.snackService.open('Este volume não existe mais')
        } else {
          this.addVolume(data)
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

  public addVolume(data: any) {

    let exit = '';

    if (this.exitList?.length === 1) {
      exit = this.exitList[0].id;
    }

    const volume = {
      amount: 0,
      location_id: '',
      material_id: data?.Material?.id,
      exit_id: exit,
      size: this.volumeData?.size,
      type: this.volumeData?.type,
      single: false,
      volume: 0
    }

    this.volumeList.push(volume);
  }

  public getTotalVolume(volume: any) {
    try {
      const material = this.materialList.find(m => m.id === volume?.material_id);
      if (volume.single) {
        return `${volume.amount} x ${volume.volume} kg = ${volume.amount * volume.volume} kg`
      } else {
        return `${volume.amount} x ${material.volume ? material.volume : '0'} kg = ${volume.amount * material.volume} kg`
      }
    }
    catch (error) {
      return 'Erro ao calcular total'
    }
  }

  public getMaterial() {

    this._materialService.combolist().subscribe(
      data => {
        this.materialList = data;
        this.loadingPoint.update(value => value + 1);
      },
    )
  }

  public deleteVolume(index: number) {
    this.volumeList.splice(index, 1)
  }

  public send() {

    if (this.volumeList.length === 0) {
      this.snackService.open('Sem novos volumes')
      return;
    }

    if (this.remaining < 0) {
      this.snackService.open('O volume retirado é maior que o volume disponível')
      return;
    }

    let stop: boolean | string = false;
    this.volumeList.map((volume) => {
      if (volume.amount < 0) {
        stop = 'Não é permitido volumes negativos', 'warning';
      }

      if ([null, '', undefined, false].includes(volume.location_id) && this.template() === 'movimentation') {
        stop = 'Selecione a nova pallete do volume';
      }

      if ([null, '', undefined, false].includes(volume.exit_id) && this.template() === 'exit') {
        stop = 'Selecione a saída';
      }

      if ([null, '', undefined, false].includes(volume.size)) {
        stop = 'Selecione o tamanho do produto';
      }

      if ([null, '', undefined, false].includes(volume.type)) {
        stop = 'Selecione o tipo do produto';
      }

      if (this.regex.isFloat(volume.amount)) {
        stop = 'Não é permitido quantidades fracionadas, utilize volumes avulsos', 'warning';
      }
    })


    if (stop) {
      this.snackService.open(stop)
      return;
    }

    const data = {
      current_volume: this.volumeData,
      updated_at: this.volumeData.updated_at,
      new_volumes: this.volumeList,
      drawn: this.totalAmount,
      drawn_weight: this.removeWeight,
      remaining: this.remaining,
      movimentation_type: this.template()
    }

    const dialogRef = this.dialog.open(DialogTransformComponent, { data: data });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.loadingService.setIsLoading(true);

          this._volumeService.transform(data).subscribe(
            response => {
              setTimeout(() => {
                this.snackService.open(response.message);
                this.router.navigate(['/in/track'])
                this.loadingService.setIsLoading(false);
              }, 2000)
            },
            excp => {
              this.snackService.open(excp.error.message);
              if ([404].includes(excp.status)) {
                this.router.navigate([this.getBackRoute(this.volumeData)])
              } else {
                this.loadingService.setIsLoading(false);
              }
            }
          )
        }
      }
    )
  }

  public getExits() {
    this._registerService.listExits().subscribe(
      data => {
        this.exitList = data;
        this.loadingPoint.update(value => value + 1);
      }
    )
  }

  public setSingle(index: number, checked: boolean) {
    if (checked) {
      this.volumeList[index].amount = 1;
      this.volumeList[index].volume = 0;
    }
  }

  public onWeightChange() {
    if (this.volumeList.length === 1) {
      this.volumeList[0].weight = this.removeWeight
    } else {
      this.volumeList.map(v => {
        v.weight = 0
      })
    }
  }

  public addAll() {
    this.removeWeight = this.volumeData?.weight
  }

  public addHalf() {
    if (this.volumeData?.weight) {
      this.removeWeight = Math.floor(this.volumeData.weight / 2);
    }
  }



}

