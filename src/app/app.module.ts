import {BrowserModule} from '@angular/platform-browser';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, CanActivate} from '@angular/router';
import {AppComponent} from './app.component';
import {DataService} from './services/data.service';
import {ToastComponent} from './shared/toast/toast.component';
import {ProfileComponent} from './profile/profile.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {SignupComponent} from './signup/signup.component';
import {ValidUrlComponent} from './valid-url/valid-url.component';
import {AuthGuard} from './services/guard.service';
import {FollowUserComponent} from './follow-user/follow-user.component';
import {HomeComponent} from './home/home.component'
import {FileSelectDirective, FileDropDirective} from 'ng2-file-upload';


const routing = RouterModule.forRoot([
  {path: '', component: HomeComponent},
  {path: 'profil', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'signup', component: SignupComponent},
  {
    path: 'email-verification', children: [{
    path: ':URL',
    component: ValidUrlComponent
  }]
  },
  {path: 'app-follow-user', component: FollowUserComponent, canActivate: [AuthGuard]}
]);

@NgModule({
  declarations: [
    AppComponent,
    ToastComponent,
    ProfileComponent,
    SidebarComponent,
    SignupComponent,
    ValidUrlComponent,
    FileSelectDirective,
    FileDropDirective,
    FollowUserComponent,
    HomeComponent
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
