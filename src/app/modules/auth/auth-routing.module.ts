import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NewAccountComponent } from './new-account/new-account.component';
import { RecoveryPasswordComponent } from './recovery-password/recovery-password.component';
import { RecoveryComponent } from './recovery/recovery.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'recovery', component: RecoveryComponent },
  { path: 'new-account/:token', component: NewAccountComponent },
  { path: 'recovery-password/:token', component: RecoveryPasswordComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
