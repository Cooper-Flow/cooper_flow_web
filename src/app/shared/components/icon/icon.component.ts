import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {

  @Input() icon: string = '';
  @Input() customClass: string = '';

  get handleIcon() {
    switch(this.icon){
      case "palette": return './assets/img/icons/palette-green.png';
      case "box": return './assets/img/icons/box.png';
      case "box_white": return './assets/img/icons/box_white.png';
      default: return ''
    }
  }

}
