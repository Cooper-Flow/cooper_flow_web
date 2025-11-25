import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/services/auth/auth.service';
import { SnackbarService } from '@app/services/common/snackbar.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrl: './recovery.component.scss'
})
export class RecoveryComponent {

  public form: FormGroup;
  public stage = signal(1);
  isLoading = signal(false);
  public email: string = ''

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    public snackbarService: SnackbarService,
  ) {
    this.form = this._formBuilder.group(
      {
        email: ['', [Validators.required]],
      }
    )
  }

  public sendRecovery() {

    if (this.form.invalid) {
      return
    }

    const data = this.form.value;
    this.email = data.email

    this.isLoading.set(true);

    this._authService.resetPassword(data).subscribe(
      response => {
        this.stage.set(2)
      },
      excp => {
        this.isLoading.set(false)
        this.snackbarService.open(excp.error.message)
      }
    )
  }

}
