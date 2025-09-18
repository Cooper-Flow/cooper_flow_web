import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTime } from '@app/resources/handlers/datetime';
import { Regex } from '@app/resources/handlers/regex';
import { LoadingService } from '@app/services/common/loading.service';
import { NavigationService } from '@app/services/common/navigation.service';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { LocationService } from '@app/services/user/location.service';
import { RegisterService } from '@app/services/user/register.service';
import { SectorService } from '@app/services/user/sector.service';
import { VolumeService } from '@app/services/user/volume.service';
import { DialogConfirmComponent } from '@app/shared/components/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-track-exit',
  templateUrl: './track-exit.component.html',
  styleUrl: './track-exit.component.scss'
})
export class TrackExitComponent implements OnInit {

  public isLoading = signal(true);
  public isLoadingVolumes = signal(true);
  public exitData: any = {};
  public date = '';
  public invoice = '';
  public locationList: Array<any> = [];
  public selectedVolumes: Array<string> = [];

  constructor(
    public navigationService: NavigationService,
    private _registerService: RegisterService,
    private _activeRoute: ActivatedRoute,
    public dateTime: DateTime,
    public dialog: MatDialog,
    private _loadingService: LoadingService,
    public snackService: SnackbarService,
    public router: Router,
    public regex: Regex,
    private _volumeService: VolumeService,
    private _locationService: LocationService
  ) { }

  ngOnInit(): void {

    const exit_id = this._activeRoute.snapshot.params['id'];

    this.getExit(exit_id);
    this.date = this.dateTime.getDateTime();
    this.getTrack()

  }

  get title() {
    return this.navigationService.getName('register');
  }

  get icon() {
    return this.navigationService.getIcon('register');
  }

  getSelectedVolumesText() {
    if(this.selectedVolumes.length === 0) {
      return 'Nenhum volume selecionado';
    }

    if(this.selectedVolumes.length === 1) {
      return '1 volume selecionado';
    }

    return `${this.selectedVolumes.length} volumes selecionados`
  }

  public getExit(id: number) {


    this._registerService.detailExit(id).subscribe(
      data => {
        this.exitData = data;
        this.isLoading.set(false);
      }
    )
  }

  public closeExit() {

    if (['', null, undefined, false].includes(this.date)) {
      this.snackService.open('Selecione a data e horário de saída')
      return
    }

    if (this.exitData?.VolumeExit?.length === 0) {
      this.snackService.open('Saída sem volumes adicionados')
      return
    }

    this._loadingService.setIsLoading(true);
  }

  public confirm() {

    const volumes = this.selectedVolumes;

    if(volumes.length === 0) return this.snackService.open('Selecione pelo menos um volume para finalizar e saída')

    const dialogRef = this.dialog.open(DialogConfirmComponent);

    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {

          const data = {
            exit_id: this.exitData.id,
            date: new Date(this.date).toISOString(),
            invoice: this.invoice,
            volumes: volumes
          }

          this._registerService.closeExit(data).subscribe(
            response => {
              this.snackService.open(response.message)
              this.router.navigate(['/in/track/exit/list']).then(() => {
                window.location.reload()
              });

            }
          )
        }
      }
    )
  }

  public undo(volume_id: string) {

    const dialogRef = this.dialog.open(DialogConfirmComponent);

    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {

          this._loadingService.setIsLoading(true);

          const data = {
            volume_id: volume_id
          }

          this._volumeService.undoVolume(data).subscribe(
            response => {
              this.snackService.open(response.message)
              setTimeout(() => {
                this.router.navigate(['/in/track/exit/list']).then(() => {
                  window.location.reload()
                });
                this._loadingService.setIsLoading(false);
              }, 2500)


            },
            excp => {
              this._loadingService.setIsLoading(false);
              this.snackService.open(excp.error.message);
            }
          )
        }
      }
    )
  }


  public getTrack() {
    this.isLoadingVolumes.set(true);

    const params = {
      sector_id: '',
      filter: ''
    }

    this._locationService.track(params).subscribe(
      data => {
        this.locationList = data.map((location: any) => {
          return {
            ...location,
            Volume: location.Volume?.map((vol: any) => ({
              ...vol,
              selected: true
            })) || []
          }
        });
        this.isLoading.set(false);
      }
    )
  }

  public includeVolume(volume_id: string) {

    const index = this.selectedVolumes.indexOf(volume_id);

    if (index > -1) {
      this.selectedVolumes.splice(index, 1);
    } else {
      this.selectedVolumes.push(volume_id);
    }
  }

}

