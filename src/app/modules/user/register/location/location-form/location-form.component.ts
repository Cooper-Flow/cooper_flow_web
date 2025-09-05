import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '@app/services/common/dialog.service';
import { NavigationService } from '@app/services/common/navigation.service';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { LocationService } from '@app/services/user/location.service';
import { ProductService } from '@app/services/user/product.service';
import { SectorService } from '@app/services/user/sector.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrl: './location-form.component.scss'
})
export class LocationFormComponent {

  public isLoading = signal(false);
  public isEditing = signal(false);
  public showError = signal(false);
  public form: FormGroup
  public location_id = signal('');
  public sectorList: Array<any> = [];

  constructor(
    public navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    public dialogService: DialogService,
    private _locationService: LocationService,
    private _sectorService: SectorService,
    private _router: Router,
    private _snackService: SnackbarService,
    private _activeRoute: ActivatedRoute
  ) {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required]],
      isActive: [true, [Validators.required]],
      sector_id: [null],
      description: [''],
    })
  }

  ngOnInit(): void {
    this.getSectors();
    const producer_id = this._activeRoute.snapshot.params['id'];

    if (producer_id) {
      this.isEditing.set(true);
      this.location_id.set(producer_id)
      this.detail(producer_id);
    }
  }


  get icon() {
    return this.navigationService.getIcon('locations');
  }

  get type() {
    return this.form.get(['type'])?.value;
  }

  get phoneLength() {
    const value = this.form.get(['phone'])?.value;

    if (value?.length < 11) {
      return '(00) 0000-00000'
    } else {
      return '(00) 00000-0000'
    }
  }

  public getSectors() {

    this._sectorService.combolist().subscribe(
      data => {
        this.sectorList = data;
      },
      error => {
        this._snackService.open(error.error.message)
      }
    )
  }

  public detail(id: string) {
    this.isLoading.set(true);

    this._locationService.detail(id).subscribe(
      data => {
        this.form.patchValue(data);
        this.isLoading.set(false);
      },
      error => {
        this.isLoading.set(false);
        this._snackService.open(error.error.message)
      }
    )
  }

  public create() {

    if (this.form.invalid) {
      this.showError.set(true)
      return
    }

    const data = this.form.value;

    this.isLoading.set(true);

    let observable: Observable<any>;

    if (this.isEditing()) {
      data.id = this.location_id();
      observable = this._locationService.update(data);
    } else {
      observable = this._locationService.create(data);
    }

    observable.subscribe(
      response => {
        this._snackService.open(response.message);
        this._router.navigate([this.navigationService.getPATH('locations')]);
      },
      error => {
        this.isLoading.set(false);
        this._snackService.open(error.error.message)
      }
    )
  }
}
