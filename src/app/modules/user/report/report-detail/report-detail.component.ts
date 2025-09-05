import { Component, OnInit, signal } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { DateTime } from '@app/resources/handlers/datetime';
import { Regex } from '@app/resources/handlers/regex';
import { NavigationService } from '@app/services/common/navigation.service';
import { RegisterService } from '@app/services/user/register.service';
import { SheetPalletComponent } from '@app/shared/components/sheets/sheet-pallet/sheet-pallet.component';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrl: './report-detail.component.scss'
})
export class ReportDetailComponent implements OnInit {

  public isLoading = signal(true);
  public registerData: any = {};

  constructor(
    public navigationService: NavigationService,
    private _registerService: RegisterService,
    public regex: Regex,
    private _activeRoute: ActivatedRoute,
    public dateTime: DateTime,
    private _bottomSheet: MatBottomSheet,
  ) { }

  ngOnInit(): void {
    const register_id = this._activeRoute.snapshot.params['id'];

    this._registerService.detail(register_id).subscribe(
      data => {
        this.registerData = data;
        this.isLoading.set(false);
      }
    )
  }

  get title() {
    return this.navigationService.getName('register');
  }

  get icon() {
    return this.navigationService.getIcon('register');
  }

  public openLocationDialog(id: string) {
    console.log(id)
    const sheets = this._bottomSheet.open(SheetPalletComponent, {
      data: {
        location_id: id
      }
    });
  }
}
