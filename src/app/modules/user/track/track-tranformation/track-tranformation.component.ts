import { Component, OnInit, Signal, signal } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DateTime } from '@app/resources/handlers/datetime';
import { Regex } from '@app/resources/handlers/regex';
import { ImagesService } from '@app/services/common/images.service';
import { NavigationService } from '@app/services/common/navigation.service';
import { LocationService } from '@app/services/user/location.service';
import { SectorService } from '@app/services/user/sector.service';
import { ActivatedRoute } from '@angular/router';
import { RegisterService } from '@app/services/user/register.service';
import { SheetPalletComponent } from '@app/shared/components/sheets/sheet-pallet/sheet-pallet.component';
import { VolumeDialogComponent } from '@app/shared/components/dialogs/volume-dialog/volume-dialog.component';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { TypesService } from '@app/services/common/types.service';
import { LoadingService } from '@app/services/common/loading.service';
import { VolumeService } from '@app/services/user/volume.service';
import { DialogConfirmComponent } from '@app/shared/components/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-track-tranformation',
  templateUrl: './track-tranformation.component.html',
  styleUrl: './track-tranformation.component.scss'
})
export class TrackTranformationComponent implements OnInit {

  public isLoading = signal(true)
  public selectedEntry: number = 0;
  public selectedExit: number = 0;
  public totalProcessWeigth = signal(0);
  public volumeProcessList: Array<any> = [];
  public volumeEntryList: Array<any> = [];
  public entryList: Array<any> = [];
  public exitList: Array<any> = [];
  public exitVolumes: Array<any> = [];

  constructor(
    public navigationService: NavigationService,
    private _locationService: LocationService,
    private _sectorService: SectorService,
    public regex: Regex,
    public dateTime: DateTime,
    public router: Router,
    public imagesService: ImagesService,
    public dialog: MatDialog,
    private _bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private _registerService: RegisterService,
    private _snackService: SnackbarService,
    public types: TypesService,
    public loadingService: LoadingService,
    private _volumeService: VolumeService,
  ) { }

  ngOnInit(): void {
    this.getExits();
    this.route.paramMap.subscribe(params => {
      const entry = params.get('id');

      this.getTransformationData(Number(entry));
    });
  }


  get title() {
    return 'Transformação';
  }

  get icon() {
    return this.navigationService.getIcon('track');
  }

  public getTransformationData(entry_id?: number) {

    if (entry_id) this.selectedEntry = Number(entry_id);

    const id = entry_id ?? this.selectedEntry

    const params = {
      entry_id: id
    }

    this._registerService.transformation(params).subscribe(
      data => {
        this.volumeProcessList = data.volumesProcess;
        this.volumeEntryList = data.volumes;
        this.entryList = data.enters;
        this.totalProcessWeigth.set(data.totalProcessWeigth);
        this.isLoading.set(false);
      },
      excp => {
        this._snackService.open(excp.error.message);
        this.router.navigate(['in/track'])
      }
    )
  }

  public openLocationDialog(id: string) {
    const sheets = this._bottomSheet.open(SheetPalletComponent, {
      data: {
        location_id: id
      }
    });

    sheets.afterDismissed().subscribe(
      response => {

      }
    )
  }

  public filterOrder(enter_id: number) {
    this.router.navigate(['/in/track/transformation/' + enter_id])
  }

  public openVolumeDialog(id: any) {
    const dialogRef = this.dialog.open(VolumeDialogComponent, {
      data: {
        volume_id: id,
        entry_id: this.selectedEntry
      }
    });

    dialogRef.afterClosed().subscribe(
      response => {
        this.getTransformationData()
      }
    )
  }

  public getExits() {

    const selectedExit = Number(localStorage.getItem('selectedExit'))

    this._registerService.listExits().subscribe(
      data => {
        this.exitList = data;

        if (selectedExit) {
          this.selectedExit = Number(selectedExit)
          this.getExitDetail(selectedExit)
        }
      }
    )
  }

  public detailExit(exitId: number) {
    this.selectedExit = Number(exitId)
    localStorage.setItem('selectedExit', String(exitId))

    this.getExitDetail(exitId)
  }

  public getExitDetail(exit_id?: any) {

    const exit = exit_id ? exit_id : this.selectedExit

    this._registerService.detailExit(Number(exit)).subscribe(
      data => {
        this.exitVolumes = data.Volume
      }
    )
  }

  public sendToExit(volume_id: string) {

    const exit_id = this.selectedExit;

    if (!exit_id) return this._snackService.open('Selecione uma saída para alocar o volume');

    const data = {
      volume_id: volume_id,
      exit_id: exit_id
    }

    this.loadingService.setIsLoading(true);

    this._volumeService.moveExit(data).subscribe(
      response => {
        this._snackService.open(response.message);
        this.refresh()
      }
    )

  }

  public undo(volume_id: string) {

    this.loadingService.setIsLoading(true);

    const data = {
      volume_id: volume_id
    }

    this._volumeService.undoVolume(data).subscribe(
      response => {
        this._snackService.open(response.message)
        this.refresh()
      },
      excp => {
        this.loadingService.setIsLoading(false);
        this._snackService.open(excp.error.message);
      }
    )
  }

  public deleteVolume(id: string) {

    const dialogRef = this.dialog.open(DialogConfirmComponent, { data: 'Deseja excluir o volume?' });

    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {

          this.loadingService.setIsLoading(true)

          this._volumeService.delete(id).subscribe(
            response => {
              this.loadingService.setIsLoading(false)
              this._snackService.open(response?.message)
              window.location.reload();
            },
            excp => {
              this._snackService.open(excp.error?.message)
              this.loadingService.setIsLoading(false)
            }
          )
        }
      }
    )
  }

  public refresh() {
    this.loadingService.setIsLoading(false);
    this.getTransformationData();
    this.getExitDetail()
  }

  public closeExit() {

    const dialogRef = this.dialog.open(DialogConfirmComponent);

    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {

          const data = {
            exit_id: this.selectedExit,
          }

          this._registerService.closeExit(data).subscribe(
            response => {
              this._snackService.open(response.message)
              this.router.navigate(['/in/track/exit/list']).then(() => {
                window.location.reload()
              });
              localStorage.removeItem('selectedExit')
            }
          )
        }
      }
    )
  }

}
