import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { ImagesService } from '@app/services/common/images.service';
import { LoadingService } from '@app/services/common/loading.service';
import { NavigationService } from '@app/services/common/navigation.service';
import { SnackbarService } from '@app/services/common/snackbar.service';
import { ProfileService } from '@app/services/user/profile.service';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.scss'
})
export class ProfileListComponent implements OnInit {

  @ViewChild('profileInput') profileInput!: ElementRef;
  public isLoading = signal(true);
  public isLoadingDetail = signal(true);
  public newProfile = signal(false);
  public newProfileName: string = '';
  public profileList: Array<any> = [];
  public selectedProfile: string = '';

  public currentProfileName: string = '';
  public permissionListFromNavigation: Array<any> = [];

  constructor(
    public navigationService: NavigationService,
    public profileService: ProfileService,
    private _snackbarService: SnackbarService,
    public loadingService: LoadingService,
    public imageService: ImagesService
  ) { }

  ngOnInit() {
    this.getProfiles();
  }

  get title() {
    return `${this.navigationService.getName('profiles')} (${this.profileList.length})`;
  }

  get icon() {
    return this.navigationService.getIcon('profiles');
  }

  public focusNew() {
    this.newProfile.set(true);
    setTimeout(() => {
      this.profileInput.nativeElement.focus();
    }, 100);
  }

  public getProfiles(autoIndex: boolean = true) {

    this.isLoading.set(true);

    this.profileService.combolist().subscribe(
      data => {
        this.profileList = data;
        this.isLoading.set(false);
        if (data.length > 0 && autoIndex) {
          this.selectProfile(data[0].id)
        }
      },
      excp => {
        this._snackbarService.open(excp.error.message);
        this.isLoading.set(false);
      }
    )
  }

  public create() {

    if ([null, '', undefined, false].includes(this.newProfileName)) {
      return this._snackbarService.open('Defina o nome do perfil')
    }

    this.loadingService.setIsLoading(true)

    const data = {
      name: this.newProfileName
    }

    this.profileService.create(data).subscribe(
      response => {
        this.clearNew()
        this.getProfiles(false)
        this.selectProfile(response.id)
        this.loadingService.setIsLoading(false)
      },
      excp => {
        this.loadingService.setIsLoading(false)
        this._snackbarService.open(excp.error.message)
      }
    )
  }

  public clearNew() {
    this.newProfile.set(false);
    this.newProfileName = ''
  }

  public selectProfile(profile_id: string) {
    this.selectedProfile = profile_id;
    this.permissionListFromNavigation = structuredClone(this.navigationService.permissionsList);
    this.detailProfile()
  }

  public detailProfile() {

    const profile_id = this.selectedProfile;

    this.isLoadingDetail.set(true)

    this.profileService.detail(profile_id).subscribe(
      data => {
        this.currentProfileName = data.name;
        this.setPermissions(data.ProfilePermission)
        this.isLoadingDetail.set(false);
      },
      excp => {
        this._snackbarService.open('Houve um erro inesperado');
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    )
  }

  public setPermissions(data: any) {
    const mapping: string[] = data.map((d: any) => d.permission);

    console.log('Mapping:', mapping);

    this.permissionListFromNavigation.forEach(p => {
      p.list.forEach((l: any) => {
        if (mapping.includes(l.code)) {
          l.selected = true;
        }
      });
    });
  }


  async update() {

    let permissions: Array<string> = [];

    this.permissionListFromNavigation.map(p => {
      p.list.map((l: any) => {
        if (l.selected === true) {
          permissions.push(l.code);
        }
      })
    })

    const data = {
      profile_id: this.selectedProfile,
      name: this.currentProfileName,
      permissions: permissions
    }

    this.loadingService.setIsLoading(true)

    this.profileService.update(data).subscribe(
      response => {
        setTimeout(() => {
          this.loadingService.setIsLoading(false);
          this._snackbarService.open('Perfil atualizado com sucesso');
          this.detailProfile();
          this.getProfiles(false)
        }, 2000)
      },
      excp => {
        this.loadingService.setIsLoading(false);
        this._snackbarService.open('Houve um erro inesperado');
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    )
  }

}
