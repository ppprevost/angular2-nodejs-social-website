import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, CanActivate} from '@angular/router';
import {AppComponent} from './app.component';
import {DataService} from './services/data.service';
import {ProfileComponent} from './profile/profile.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {ToastyModule} from 'ng2-toasty';
import {SignupComponent} from './signup/signup.component';
import {ValidUrlComponent} from './valid-url/valid-url.component';
import {AuthGuard} from './services/guard.service';
import {FollowUserComponent} from './follow-user/follow-user.component';
import {HomeComponent} from './home/home.component'
import {FileUploadModule} from 'ng2-file-upload';
import {MyProfileComponent} from './my-profile/my-profile.component';
import {FollowComponent} from './utils/follow/follow.component';
import {WasteComponent} from './utils/waste/waste.component';
import {ValidPictureDirective} from './utils/valid-picture.directive';
import {MdRadioModule, MdInputModule} from '@angular/material';

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
  {
    path: 'my-profile/:id',
    component: MyProfileComponent,
    canActivate: [AuthGuard]//,
    // resolve: {user: MyProfileResolve}
  },
  {path: 'app-follow-user', component: FollowUserComponent, canActivate: [AuthGuard]}
]);

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    SidebarComponent,
    SignupComponent,
    ValidUrlComponent,
    FollowUserComponent,
    HomeComponent,
    MyProfileComponent,
    FollowComponent,
    WasteComponent,
    ValidPictureDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FileUploadModule,
    ReactiveFormsModule,
    MdRadioModule,
    MdInputModule,
    ToastyModule.forRoot(),
    HttpModule,
    routing
  ],
  providers: [
    DataService,
    AuthGuard
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule {
}
