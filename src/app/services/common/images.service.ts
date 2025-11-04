import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  public logo = './assets/img/new_logo.png';
  public logoMin = './assets/img/logo_min.png';
  public background_login = './assets/img/background.jpg';
  public logoClient = './assets/img/logo_client.png';

  //Icons
  public user_icon = './assets/img/icons/user.jpg';
  public fruit_icon = './assets/img/icons/fruit.jpg';
  public pallete = './assets/img/icons/pallete.png';

  public getRgbaColorFromName(name: string, alpha = 0.5): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }

    const r = (hash >> 16) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = hash & 0xff;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

}
