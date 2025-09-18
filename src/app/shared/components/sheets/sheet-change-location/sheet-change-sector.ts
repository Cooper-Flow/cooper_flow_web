import { Component, Inject, OnInit, signal } from '@angular/core';
import { LocationService } from '@app/services/user/location.service';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Regex } from '@app/resources/handlers/regex';
import { DateTime } from '@app/resources/handlers/datetime';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VolumeService } from '@app/services/user/volume.service';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { LoadingService } from '@app/services/common/loading.service';
import { DialogConfirmComponent } from '../../dialog-confirm/dialog-confirm.component';
import { SectorService } from '@app/services/user/sector.service';

@Component({
  selector: 'app-sheet-change-sector',
  templateUrl: './sheet-change-sector.component.html',
  styleUrl: './sheet-change-sector.scss'
})
export class SheetChangeSectorComponent implements OnInit {

  public isLoading = signal(true);
  public requestSuccess = signal(true);
  public palletData: any = {};
  public sectorList: Array<any> = [];
  public sector_id = "";

  constructor(
    public locationService: LocationService,
    private _bottomSheetRef: MatBottomSheetRef<SheetChangeSectorComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    public regex: Regex,
    public dateTime: DateTime,
    public router: Router,
    public dialog: MatDialog,
    public volumeService: VolumeService,
    public snackService: SnackbarService,
    public loadingService: LoadingService,
    private _sectorService: SectorService,

  ) { }

  ngOnInit(): void {
    this.getLocation();
    this.getSectors()
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

  public getSectors() {

    this._sectorService.combolist().subscribe(
      data => {
        this.sectorList = data;
      }
    )
  }

  public saveChange() {

    this.loadingService.setIsLoading(true);
    const location_id = this.data.location_id

    const data = {
      location_id: location_id,
      new_sector_id: this.sector_id
    }

    this._bottomSheetRef.dismiss();

    this.locationService.changeSector(data).subscribe(
      response => {
        this.snackService.open(response.message);
        this.loadingService.setIsLoading(false);
      },
      excp => {
        this.snackService.open('Houve um erro ao mudar localização');
        window.location.reload()
      }
    )
  }


}
