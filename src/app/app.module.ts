import { MatFormFieldModule,MatProgressSpinnerModule,MatButtonModule,MatStepperModule, MatSelectModule,MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from "./auth/registration/registration.component";
import { LoginComponent } from "./auth/login/login.component";

import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

import { RegisterComponent } from './register/register.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FileSelectDirective } from 'ng2-file-upload';
import { HomeComponent } from './home/home.component';
import { PostsComponent } from './posts/posts.component';
import { PostComponent } from './posts/post/post.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage'
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule , FirestoreSettingsToken  } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import {environment} from '../environments/environment';
import { AmazingTimePickerModule} from 'amazing-time-picker';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { HelpComponent } from './help/help.component';

const appRoutes: Routes = [
  {
    path:'posts/upload/:key/:isedited',component:PostComponent
  },
  {
    path:'',redirectTo:'posts/upload',pathMatch:'full'
  },
  {
    path:'posts',component:PostsComponent,children:[
      {path:'upload',component:PostComponent},
      {path:'list',component:PostListComponent}
    ]
  },
  {
    path: '',
    component: HomeComponent,
    data: { title: 'Home' }
  },
  {
    path: 'help',
    component: HelpComponent,
    data: { title: 'Help' }
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegistrationComponent
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent
  },
  // {
  //   path: 'products',
  //   component: ProductComponent,
  //   data: { title: 'Product List' }
  // },
  // {
  //   path: 'product-details/:id',
  //   component: ProductDetailComponent,
  //   data: { title: 'Product Details' }
  // },
  // {
  //   path: 'product-add',
  //   component: ProductAddComponent,
  //   data: { title: 'Product Add' }
  // },
  // {
  //   path: 'product-edit/:id',
  //   component: ProductEditComponent,
  //   data: { title: 'Product Edit' }
  // },
  // { path: '',
  //   redirectTo: '/products',
  //   pathMatch: 'full'
  // },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' }
  },
  // {
  //   path: 'try',
  //   component: TryComponent,
  //   data: { title: 'Try' }
  // }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FileSelectDirective,
    HomeComponent,
    PostsComponent,
    PostComponent,
    PostListComponent,
    HelpComponent,
    RegistrationComponent,
    LoginComponent,
    ForgotPasswordComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    ReactiveFormsModule, 
    MatFormFieldModule,          // <----- this module will be deprecated in the future version.
    MatDatepickerModule,        // <----- import(must)
    MatNativeDateModule,        // <----- import for date formating(optional)
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    AmazingTimePickerModule,
    MatStepperModule,
    MatFileUploadModule,
    MatProgressSpinnerModule
  ],
  providers: [{ provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
