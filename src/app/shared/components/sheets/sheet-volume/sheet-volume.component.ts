import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-sheet-volume',
  templateUrl: './sheet-volume.component.html',
  styleUrl: './sheet-volume.component.scss'
})
export class SheetVolumeComponent {

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<SheetVolumeComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {}


  public openLink(type: string): void {
    this._bottomSheetRef.dismiss(type);
  }

}
