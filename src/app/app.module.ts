import {
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatButtonModule,
  MatStepperModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule
} from "@angular/material";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { SignInComponent } from "./auth/sign-in/sign-in.component";
import { DashboardComponent } from "./auth/dashboard/dashboard.component";
import { ForgotPasswordComponent } from "./auth/forgot-password/forgot-password.component";
import { VerifyEmailComponent } from "./auth/verify-email/verify-email.component";

// Import canActivate guard services
import { AuthGuard } from "./shared/guard/auth.guard";
import { SecureInnerPagesGuard } from "./shared/guard/secure-inner-pages.guard.ts.guard";

import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "./auth/auth.service";
import { FileSelectDirective } from "ng2-file-upload";
import { HomeComponent } from "./home/home.component";
import { PostComponent } from "./posts/post/post.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { AngularFireModule } from "@angular/fire";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import {
  AngularFirestoreModule,
  FirestoreSettingsToken
} from "@angular/fire/firestore";
import { ReactiveFormsModule } from "@angular/forms";
import { environment } from "../environments/environment";
import { AmazingTimePickerModule } from "amazing-time-picker";
import { MatFileUploadModule } from "angular-material-fileupload";
import { HelpComponent } from "./help/help.component";
import { PageNotFoundComponent } from "./auth/page-not-found/page-not-found.component";
import { ChefProfileComponent } from "./profiles/chef-profile/chef-profile.component";
import { RecipeComponent } from "./recipe/recipe.component";
import { CartComponent } from "./cart/cart.component";
import { CustomerSignUpComponent } from "./auth/sign-up/customer-sign-up/customer-sign-up.component";
import { TermsAndConditionsComponent } from "./help/terms-and-conditions/terms-and-conditions.component";
import { ActivepostComponent } from "./activepost/activepost.component";
import { InactivepostComponent } from "./inactivepost/inactivepost.component";

const appRoutes: Routes = [
  {
    path: "",
    component: HomeComponent,
    data: { title: "Home" }
  },
  { path: "", redirectTo: "/sign-in", pathMatch: "full" },
  {
    path: "sign-in",
    component: SignInComponent,
    canActivate: [SecureInnerPagesGuard]
  },
  {
    path: "register-user",
    component: CustomerSignUpComponent,
    canActivate: [SecureInnerPagesGuard]
  },
  {
    path: "active-post",
    component: ActivepostComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "inactive-post",
    component: InactivepostComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "chefprofile",
    component: ChefProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "chefprofile/:key",
    component: ChefProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
    canActivate: [SecureInnerPagesGuard]
  },
  {
    path: "verify-email-address",
    component: VerifyEmailComponent,
    canActivate: [SecureInnerPagesGuard]
  },
  { path: "recipe/:key", component: RecipeComponent, canActivate: [AuthGuard] },
  { path: "cart/:key", component: CartComponent, canActivate: [AuthGuard] },
  {
    path: "posts/upload/:key/:isedited",
    component: PostComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "",
    redirectTo: "posts/upload",
    pathMatch: "full",
    canActivate: [AuthGuard]
  },
  { path: "posts/upload", component: PostComponent, canActivate: [AuthGuard] },
  {
    path: "posts/list",
    component: PostListComponent,
    canActivate: [AuthGuard]
  },

  {
    path: "help",
    component: HelpComponent,
    data: { title: "Help", canActivate: [AuthGuard] }
  },
  {
    path: "terms_and_conditions",
    component: TermsAndConditionsComponent,
    data: { title: "terms_and_conditions" }
  },

  {
    path: "home",
    component: HomeComponent
  },
  { path: "**", component: PageNotFoundComponent }
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

  // {
  //   path: 'try',
  //   component: TryComponent,
  //   data: { title: 'Try' }
  // }
];

@NgModule({
  declarations: [
    AppComponent,
    FileSelectDirective,
    HomeComponent,
    PostComponent,
    PostListComponent,
    HelpComponent,
    ForgotPasswordComponent,
    SignInComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    PageNotFoundComponent,
    ChefProfileComponent,
    RecipeComponent,
    CartComponent,
    CustomerSignUpComponent,
    TermsAndConditionsComponent,
    ActivepostComponent,
    InactivepostComponent
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
    MatFormFieldModule, // <----- this module will be deprecated in the future version.
    MatDatepickerModule, // <----- import(must)
    MatNativeDateModule, // <----- import for date formating(optional)
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    AmazingTimePickerModule,
    MatStepperModule,
    MatFileUploadModule,
    MatProgressSpinnerModule
  ],
  providers: [{ provide: FirestoreSettingsToken, useValue: {} }, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}
