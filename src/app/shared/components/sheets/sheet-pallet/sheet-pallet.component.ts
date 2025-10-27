import { Component, Inject, OnInit, signal } from '@angular/core';
import { LocationService } from '@app/services/user/location.service';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Regex } from '@app/resources/handlers/regex';
import { DateTime } from '@app/resources/handlers/datetime';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VolumeService } from '@app/services/user/volume.service';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { LoadingService } from '@app/services/common/loading.service';
import { DialogConfirmComponent } from '../../dialog-confirm/dialog-confirm.component';
import { SheetChangeSectorComponent } from '../sheet-change-location/sheet-change-sector';

@Component({
  selector: 'app-sheet-pallet',
  templateUrl: './sheet-pallet.component.html',
  styleUrl: './sheet-pallet.component.scss'
})
export class SheetPalletComponent implements OnInit {

  public isLoading = signal(true);
  public requestSuccess = signal(true);
  public palletData: any = {};
  public groupMode = signal(false);
  public selectedGroupVolumes: Array<string> = [];

  constructor(
    public locationService: LocationService,
    private _bottomSheetRef: MatBottomSheetRef<SheetPalletComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public regex: Regex,
    public dateTime: DateTime,
    public router: Router,
    public dialog: MatDialog,
    public volumeService: VolumeService,
    public snackService: SnackbarService,
    public loadingService: LoadingService,
    private _bottomSheet: MatBottomSheet,

  ) { }

  ngOnInit(): void {
    this.getLocation();
  }

  public getLocation() {

    const location_id = this.data.location_id

    this.locationService.detail(location_id).subscribe(
      data => {
        this.palletData = data;
        this.isLoading.set(false)
        this.requestSuccess.set(true);
      }
    )
  }

  public navigateRegister(id: string) {
    this._bottomSheetRef.dismiss()
    this.router.navigate(['/in/register/' + id])
  }

  public navigateTrack(id: string, template: string) {
    this._bottomSheetRef.dismiss()
    this.router.navigate(['/in/track/transform/' + id], { queryParams: { template: template } })
  }

  public deleteVolume(id: string) {

    const dialogRef = this.dialog.open(DialogConfirmComponent, { data: 'Deseja excluir o volume?' });

    this._bottomSheetRef.dismiss()

    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {

          this.loadingService.setIsLoading(true)

          this.volumeService.delete(id).subscribe(
            response => {
              this.loadingService.setIsLoading(false)
              this.snackService.open(response?.message)
              window.location.reload();
            },
            excp => {
              this.snackService.open(excp.error?.message)
              this.loadingService.setIsLoading(false)
            }
          )
        }
      }
    )
  }

  public openChangeSector() {

    const location_id = this.data.location_id

    const sheets = this._bottomSheet.open(SheetChangeSectorComponent, {
      data: {
        location_id: location_id
      }
    });

    sheets.afterDismissed().subscribe(
      response => {
        if (response) {
          window.location.reload();
        }
      }
    )
  }

  public initGroup(init: boolean, volume_id: string) {
    this.selectedGroupVolumes = [];

    if (init) {
      this.selectedGroupVolumes.push(volume_id)
    }

    this.groupMode.set(init);
  }

  public includeGroupVolume(volume_id: string) {

    if (!this.groupMode()) return;

    if (this.selectedGroupVolumes.includes(volume_id)) {
      this.selectedGroupVolumes = this.selectedGroupVolumes.filter(id => id !== volume_id);
    } else {
      this.selectedGroupVolumes.push(volume_id);
    }
  }

  public salveGroup() {
    if(this.selectedGroupVolumes.length <= 0) {
      return this.snackService.open('Nenhum volume selecionado')
    }
  }

}
