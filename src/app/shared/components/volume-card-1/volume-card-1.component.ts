import { Router } from '@angular/router';
import { routes } from './../../../app.routes';
import { Component, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DateTime } from '@app/resources/handlers/datetime';
import { Regex } from '@app/resources/handlers/regex';
import { SheetVolumeComponent } from '../sheets/sheet-volume/sheet-volume.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { VolumeService } from '@app/services/user/volume.service';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { LoadingService } from '@app/services/common/loading.service';

interface volumeProps {
  id: string
  entry_id: string
  product_name: string
  type: string
  size: string
  amount: number
  weight: number
  volume: number
  volume_type: string
  created_at: string
  Entry: {
    Register: any
    Producer: {
      Person: {
        name: string
      }
    }
  }
  Product:{
    name: string
  }
  Material:{
    name: string
  }
}

@Component({
  selector: 'app-volume-card-1',
  templateUrl: './volume-card-1.component.html',
  styleUrl: './volume-card-1.component.scss'
})
export class VolumeCard1Component {

  @Input() public volume: volumeProps = {
    id: '',
    entry_id: '',
    product_name: '',
    amount: 0,
    weight: 0,
    created_at: '',
    size: '',
    type: '',
    volume: 0,
    volume_type: '',
    Entry: {
      Register: {},
      Producer: {
        Person: {
          name: ''
        }
      }
    },
    Material: {
      name: ''
    },
    Product: {
      name: ''
    }
  }

  constructor(
    public regex: Regex,
    public dateTime: DateTime,
    private _bottomSheet: MatBottomSheet,
    public router: Router,
    public dialog: MatDialog,
    public volumeService: VolumeService,
    public snackService: SnackbarService,
    public loadingService: LoadingService,
  ){}

  public openBottomSheet() {
    const sheets = this._bottomSheet.open(SheetVolumeComponent);

    sheets.afterDismissed().subscribe(
      response => {
        switch(response){
          case 'register':{
            this.router.navigate(['/in/register/' + this.volume?.Entry?.Register?.id])
            break
          }
          case 'moviment':{
            this.router.navigate(['/in/track/transform/' + this.volume.id])
            break
          }
          case 'delete':{
            this.deleteVolume();
            break
          }
        }
      }
    )
  }

  public deleteVolume() {

    const dialogRef = this.dialog.open(DialogConfirmComponent, { data: 'Deseja excluir o volume?' });

    dialogRef.afterClosed().subscribe(
      response => {
        if(response) {

          this.loadingService.setIsLoading(true)

          this.volumeService.delete(this.volume.id).subscribe(
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

}
