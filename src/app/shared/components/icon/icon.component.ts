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
      case "location": return './assets/img/icons/location.png';
      case "farmer": return './assets/img/icons/farmer.png';
      case "weight": return './assets/img/icons/weight.png';
      case "material": return './assets/img/icons/material.png';
      default: return ''
    }
  }

}
