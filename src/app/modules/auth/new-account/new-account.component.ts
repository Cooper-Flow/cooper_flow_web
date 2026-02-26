import { Component, OnInit, signal } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/services/auth/auth.service';
import { ImagesService } from '@app/services/common/images.service';
import { NavigationService } from '@app/services/common/navigation.service';
import { SnackbarService } from '@app/services/common/snackbar.service';


@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrl: './new-account.component.scss'
})
export class NewAccountComponent implements OnInit {

  public form: FormGroup;
  hide = signal(true);
  hide2 = signal(true);
  isLoading = signal(false);
  isReady = signal(false);
  error = signal('');
  email = signal('');
  token = signal('');

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    public imagesService: ImagesService,
    public snackbarService: SnackbarService,
    private _router: Router,
    public navigationService: NavigationService,
    private _activeRoute: ActivatedRoute
  ) {
    this.form = this._formBuilder.group(
      {
        password: ['', [Validators.required]],
        confirm: ['', [Validators.required]]
      }
    )
  }

  ngOnInit(): void {
    this.checkToken();
  }

  public checkToken() {

    const token = this._activeRoute.snapshot.params['token'];
    this.token.set(token)

    this._authService.validatePassword(token).subscribe(
      response => {
        this.email.set(response?.email)
        this.isReady.set(true)
      }
    )
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  clickEvent2(event: MouseEvent) {
    this.hide2.set(!this.hide());
    event.stopPropagation();
  }

  public createPassword() {

    if(this.form.invalid) {
      return
    }

    const data = this.form.value;

    if(data.password.length < 6) {
      this.error.set('É necessário no mínimo 6 caracteres');
      return
    } else {
      this.error.set('')
    }

    if(data.password !== data.confirm) {
      this.error.set('Senhas não coincidem');
      return
    } else {
      this.error.set('')
    }

    this.isLoading.set(true);

    data.email = this.email();
    data.token = this.token();

    this._authService.setPassword(data).subscribe(
      response => {
        this.snackbarService.open(response.message);
        this._authService.clearAuthData();
      },
      error => {
        this.isLoading.set(false);
        this.snackbarService.open(error.error.message)
      }
    )
  }

}
