import { Inject, Injectable, signal } from "@angular/core";
import { RegisterService } from "../user/register.service";
import { PermissionEnum } from "@app/enum/permissions.enum";
import { Router } from "@angular/router";
import { SnackbarService } from "./snackbar.service";
import { ProfileService } from "../user/profile.service";
import { firstValueFrom } from "rxjs";

interface childProps {
  permission: string,
  page: string
  name: string
  icon: string
  path: string
}

interface MenuProps {
  type: string
  child: childProps[]
}

@Injectable({
  providedIn: 'root'
})

export class NavigationService {

  public isOpen = signal(false);
  public hasExits = signal(0);
  public permissions: Array<string> = [];

  constructor(
    private _registerService: RegisterService,
    public router: Router,
    public snackService: SnackbarService,
    private _profileService: ProfileService
  ) { }

  public getExits() {
    this._registerService.listExits().subscribe(
      data => {
        this.hasExits.set(data?.length);
      }
    )
  }


  public getPATH(page: string) {

    let obj = '/in/home';

    this.internal.map(i => {
      i.child.map((c: any) => {
        if (page === c.page) {
          obj = c.path;
        }
      })
    })

    return obj;
  }

  public getName(page: string) {

    let obj = '';

    this.internal.map(i => {
      i.child.map((c: any) => {
        if (page === c.page) {
          obj = c.name;
        }
      })
    })

    return obj;
  }

  public getIcon(page: string) {

    let obj = '';

    this.internal.map(i => {
      i.child.map((c: any) => {
        if (page === c.page) {
          obj = c.icon;
        }
      })
    })

    return obj;
  }

  public internal: Array<MenuProps> = [
    {
      type: '',
      child: [
        {
          permission: PermissionEnum.T01,
          page: 'track',
          name: 'Rastreabilidade',
          icon: 'account_tree',
          path: '/in/track'
        },
        {
          permission: PermissionEnum.T01,
          page: 'register',
          name: 'Registros',
          icon: 'app_registration',
          path: '/in/register'
        },
        {
          permission: PermissionEnum.T07,
          page: 'report_manager',
          name: 'Relatório',
          icon: 'add_chart',
          path: '/in/report-manager'
        },
        {
          permission: PermissionEnum.P01,
          page: 'price_manager',
          name: 'Precificação',
          icon: 'request_page',
          path: '/in/price-manager'
        },
        // {
        //   page: 'stock',
        //   name: 'Estoque',
        //   icon: 'inventory_2',
        //   path: '/in/stock'
        // },
      ]
    },
    {
      type: 'Cadastros',
      child: [
        {
          permission: PermissionEnum.R01,
          page: 'persons',
          name: 'Pessoas',
          icon: 'group',
          path: '/in/persons'
        },
        {
          permission: PermissionEnum.R02,
          page: 'products',
          name: 'Produtos',
          icon: 'nature',
          path: '/in/products'
        },
        {
          permission: PermissionEnum.R03,
          page: 'sectors',
          name: 'Localizações',
          icon: 'pin_drop',
          path: '/in/sectors'
        },
        {
          permission: PermissionEnum.R04,
          page: 'locations',
          name: 'Paletes',
          icon: 'pallet',
          path: '/in/locations'
        },
        {
          permission: PermissionEnum.R05,
          page: 'materials',
          name: 'Materiais',
          icon: 'inventory',
          path: '/in/materials'
        },
      ]
    },
    {
      type: 'Sistema',
      child: [
        {
          permission: PermissionEnum.S01,
          page: 'profiles',
          name: 'Perfis',
          icon: 'manage_accounts',
          path: '/in/profiles'
        },
        // {
        //   page: 'settings',
        //   name: 'Configurações',
        //   icon: 'settings',
        //   path: '/in/setting'
        // },
      ]
    }
  ]

  public permissionsList = [
    {
      category: 'Rastreabilidade',
      list: [
        {
          code: PermissionEnum.T01,
          description: 'Pode acessar Rastreabilidade',
          selected: false
        },
        {
          code: PermissionEnum.T02,
          description: 'Pode criar entradas',
          selected: false
        },
        {
          code: PermissionEnum.T03,
          description: 'Pode criar saídas',
          selected: false
        },
        {
          code: PermissionEnum.T04,
          description: 'Pode movimentar volumes entre paletes',
          selected: false
        },
        {
          code: PermissionEnum.T05,
          description: 'Pode movimentar volumes para saídas',
          selected: false
        },
        {
          code: PermissionEnum.T06,
          description: 'Pode excluir volumes',
          selected: false
        },
        {
          code: PermissionEnum.T07,
          description: 'Pode acessar relatórios',
          selected: false
        },
      ]
    },
    {
      category: 'Precificação',
      list: [
        {
          code: PermissionEnum.P01,
          description: 'Pode gerenciar precificações',
          selected: false
        },
      ]
    },
    {
      category: 'Cadastros',
      list: [
        {
          code: PermissionEnum.R01,
          description: 'Pode gerenciar cadastro de pessoas',
          selected: false
        },
        {
          code: PermissionEnum.R02,
          description: 'Pode gerenciar cadastro de produtos',
          selected: false
        },
        {
          code: PermissionEnum.R03,
          description: 'Pode gerenciar cadastro de localizações',
          selected: false
        },
        {
          code: PermissionEnum.R04,
          description: 'Pode gerenciar cadastro de paletes',
          selected: false
        },
        {
          code: PermissionEnum.R05,
          description: 'Pode gerenciar cadastro de materiais',
          selected: false
        },
      ]
    },
    {
      category: 'Sistema',
      list: [
        {
          code: PermissionEnum.S01,
          description: 'Pode gerenciar perfis',
          selected: false
        },
      ]
    },
  ]

  public async checkComponentPass(permission: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(this._profileService.checkPermission(permission));
      if (response.pass) {
        return true;
      } else {
        this.router.navigate(['']);
        this.snackService.open('Usuário sem permissão para acessar esta página');
        return false;
      }
    } catch {
      return false;
    }
  }
}
