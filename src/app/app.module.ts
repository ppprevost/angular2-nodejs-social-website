import {BrowserModule} from '@angular/platform-browser';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, CanActivate } from '@angular/router';
import {AppComponent} from './app.component';
import {DataService} from './services/data.service';
import {ToastComponent} from './shared/toast/toast.component';
import {ProfileComponent} from './profile/profile.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {SignupComponent} from './signup/signup.component';
import {ValidUrlComponent} from './valid-url/valid-url.component';
import {AuthGuard} from './services/guard.service'

const routing = RouterModule.forRoot([
  {path: '', component: AppComponent},
  {path: 'profil', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'signup', component: SignupComponent},
  {
    path: 'email-verification', children: [{
    path: ':URL',
    component: ValidUrlComponent
  }]
  }
]);

@NgModule({
  declarations: [
    AppComponent,
    ToastComponent,
    ProfileComponent,
    SidebarComponent,
    SignupComponent,
    ValidUrlComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing
  ],
  providers: [
    DataService,
    AuthGuard,
    ToastComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule {
}
