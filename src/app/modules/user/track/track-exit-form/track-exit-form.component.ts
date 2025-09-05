import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DateTime } from '@app/resources/handlers/datetime';
import { DialogService } from '@app/services/common/dialog.service';
import { NavigationService } from '@app/services/common/navigation.service';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { RegisterService } from '@app/services/user/register.service';
import { SelectorCustomerComponent } from '@app/shared/components/selector-customer/selector-customer.component';
import { SelectorProducerComponent } from '@app/shared/components/selector-producer/selector-producer.component';

@Component({
  selector: 'app-track-exit-form',
  templateUrl: './track-exit-form.component.html',
  styleUrl: './track-exit-form.component.scss'
})
export class TrackExitFormComponent {

  public isLoading = signal(true);
  public form: FormGroup;
  public showError = signal(false);
  public selectedCustomer = signal(false);
  public customer: any = {};

  constructor(
    public navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    public dateTime: DateTime,
    public dialog: MatDialog,
    private _dialog: DialogService,
    private _registerService: RegisterService,
    public router: Router,
    public snackService: SnackbarService
  ) {
    this.form = this._formBuilder.group({
      date: [this.dateTime.getDateTime(), [Validators.required]],
      exit_type: ['wholesale', [Validators.required]],
      observation: ['']
    })
  }

  ngOnInit(): void {
    this.getReport();
  }

  get title() {
    return this.navigationService.getName('register');
  }

  get icon() {
    return this.navigationService.getIcon('register');
  }

  public getReport() {
    this.isLoading.set(false);
  }

  public dialogProducer() {
    const dialogRef = this.dialog.open(SelectorCustomerComponent);

    dialogRef.afterClosed().subscribe(
      response => {
        if (response) {
          this.selectedCustomer.set(true)
          this.customer = response
        }
      }
    )
  }

  public create() {
    if (this.form.invalid) {
      this.showError.set(true)
      return
    }
    const data = this.form.value;

    if (this.selectedCustomer() === false) {
      this.snackService.open('Selecione o produtor')
      return
    }

    data.customer = this.customer;

    data.exit_at = new Date(data.date).toISOString();

    this.isLoading.set(true);

    this._registerService.createExit(data).subscribe(
      response => {
        this.snackService.open(response.message);
        this.navigationService.getExits();
        this.router.navigate(['/track/exit/list'])
      },
      excp => {
        this.snackService.open(excp.error.message);
        this.isLoading.set(false);
      }
    )

  }
}
