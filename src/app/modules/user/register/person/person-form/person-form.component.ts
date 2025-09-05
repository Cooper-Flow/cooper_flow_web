import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '@app/services/common/dialog.service';
import { NavigationService } from '@app/services/common/navigation.service';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { PersonService } from '@app/services/user/person.service';
import { ProfileService } from '@app/services/user/profile.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrl: './person-form.component.scss'
})
export class PersonFormComponent {

  public isLoading = signal(false);
  public isEditing = signal(false);
  public showError = signal(false);
  public form: FormGroup;
  public form_user: FormGroup;
  public form_producer: FormGroup;
  public form_customer: FormGroup;
  public user_id = signal('');
  public profiles = new FormControl([]);

  public profileList: Array<any> = [];

  constructor(
    public navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    public dialogService: DialogService,
    private _personService: PersonService,
    private _router: Router,
    private _snackService: SnackbarService,
    private _activeRoute: ActivatedRoute,
    public profileService: ProfileService
  ) {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      phone2: [''],
      address: ['', [Validators.required]],
      type: [1, [Validators.required]],
      cpf_cnpj: ['', [Validators.required]],
      isCustomer: [false, [Validators.required]],
      isProducer: [false, [Validators.required]],
      isUser: [false, [Validators.required]]
    });

    this.form_user = this._formBuilder.group({
      user: ['', [Validators.required]],
      isActive: [true, [Validators.required]],
    })

    this.form_producer = this._formBuilder.group({
      cad_pro: [''],
      ggn: [''],
    })

    this.form_customer = this._formBuilder.group({

    })


  }

  ngOnInit(): void {
    const user_id = this._activeRoute.snapshot.params['id'];

    if (user_id) {
      this.isEditing.set(true);
      this.user_id.set(user_id)
      this.detail(user_id);
    }

    this.getProfiles();
  }


  get icon() {
    return this.navigationService.getIcon('persons');
  }

  get type() {
    return this.form.get(['type'])?.value;
  }

  public detail(id: string) {
    this.isLoading.set(true);

    this._personService.detail(id).subscribe(
      data => {
        this.form.patchValue(data);
        this.form_user.patchValue(data.User);
        this.form_producer.patchValue(data.Producer);
        this.isLoading.set(false);

        const profiles = data?.User?.ProfileUser.map((p: any) => p.profile_id);
        this.profiles.patchValue(profiles);
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

    if (this.form.get(['isUser'])?.value && this.form_user.invalid) {
      this.showError.set(true)
      return
    }

    if (this.form.get(['isProducer'])?.value && this.form_producer.invalid) {
      this.showError.set(true)
      return
    }

    this.isLoading.set(true);

    const data = this.form.value;
    data.user = this.form_user.value;
    data.producer = this.form_producer.value;
    data.profiles = this.profiles.value;

    let observable: Observable<any>;

    if (this.isEditing()) {
      data.id = this.user_id();
      observable = this._personService.update(data);
    } else {
      observable = this._personService.create(data);
    }

    observable.subscribe(
      response => {
        this._snackService.open(response.message);
        this._router.navigate([this.navigationService.getPATH('persons')]);
      },
      error => {
        this.isLoading.set(false);
        this._snackService.open(error.error.message)
      }
    )
  }

  public setUser() {

    const email = this.form.get(['email'])?.value;

    this.form_user.get(['user'])?.setValue(email)

  }

  public getProfiles() {
    this.profileService.combolist().subscribe(
      response => {
        this.profileList = response
      },
      error => {
        this._snackService.open(error.error.message)
      }
    )
  }
}
