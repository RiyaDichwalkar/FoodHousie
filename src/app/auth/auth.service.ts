import { Injectable, NgZone } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
//*****changes below */
import { auth } from "firebase/app";
@Injectable({
  providedIn: "root"
})
export class AuthService {
  private eventAuthError = new BehaviorSubject<string>("");
  eventAuthError$ = this.eventAuthError.asObservable();

  newUser: any;
  userData: any; // Save logged in user data

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    //==============NOW COPIED===============
    // this.afAuth.authState.subscribe(user => {
    //   if (user) {
    //     this.userData = user;
    //     localStorage.setItem("user", JSON.stringify(this.userData));
    //     JSON.parse(localStorage.getItem("user"));
    //   } else {
    //     localStorage.setItem("user", null);
    //     JSON.parse(localStorage.getItem("user"));
    //   }
    // });
  }
  getUserState() {
    return this.afAuth.authState;
  }
  login(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.eventAuthError.next(error);
      })
      .then(userCredential => {
        if (userCredential) {
          this.router.navigate(["/home"]);
          //**Changes***
          // this.SetUserData(userCredential.user);
        }
      });
  }
  createUser(user) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(userCredential => {
        // console.log(userCredential);
        this.newUser = user;

        userCredential.user.updateProfile({
          displayName: user.firstName + " " + user.lastName
        });
        this.insertUserData(userCredential).then(() => {
          this.router.navigate(["/home"]);
        });
        //**Changes***
        this.SendVerificationMail();
      })
      .catch(error => {
        this.eventAuthError.next(error);
      });
  }

  insertUserData(userCredential: firebase.auth.UserCredential) {
    return this.db.doc(`Users/${userCredential.user.uid}`).set({
      email: this.newUser.email,
      firstname: this.newUser.firstName,
      lastname: this.newUser.lastName,
      role: "customer",
      emailVerified: userCredential.user.emailVerified
    });
  }
  // ****Changes*******
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
      window.alert("Verification Email has been sent to your account");
    });
  }
  logout() {
    return this.afAuth.auth.signOut();
    // .then(() => {
    //   localStorage.removeItem('user');
    //   this.router.navigate(['sign-in']);
    // })
  }

  resetPassword(passwordResetEmail) {
    return this.afAuth.auth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert("Password reset email sent, check your inbox.");
        this.router.navigate(["/home"]);
      })
      .catch(error => {
        this.eventAuthError.next(error);
      });
  }
}
