import { Inject, Injectable } from "@angular/core";

interface childProps {
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

  public getPATH(page: string) {

    this.internal.map(i => {
      i.child.map((c: any) => {
        if (page === c.page) {
          return c.path;
        }
      })
    })

    return '/in/home';

  }

  public internal: Array<MenuProps> = [
    {
      type: '',
      child: [
        {
          page: 'home',
          name: 'Rastreabilidade',
          icon: 'account_tree',
          path: '/in/home'
        },
        {
          page: 'movimentation',
          name: 'Entrada e Saída',
          icon: 'repeat',
          path: '/in/movimentation'
        },
        {
          page: 'stock',
          name: 'Estoque',
          icon: 'inventory_2',
          path: '/in/stock'
        },
      ]
    },
    {
      type: 'Cadastros',
      child: [
        {
          page: 'users',
          name: 'Usuários',
          icon: 'group',
          path: '/in/users'
        },
        {
          page: 'farmers',
          name: 'Produtores',
          icon: 'compost',
          path: '/in/farmers'
        },
        {
          page: 'customers',
          name: 'Clientes',
          icon: 'handshake',
          path: '/in/customers'
        },
        {
          page: 'products',
          name: 'Produtos',
          icon: 'nature',
          path: '/in/products'
        },
        {
          page: 'locations',
          name: 'Localizações',
          icon: 'flag',
          path: '/in/locations'
        },
        {
          page: 'materials',
          name: 'Materiais',
          icon: 'inventory',
          path: '/in/locations'
        },
      ]
    }
  ]
}
