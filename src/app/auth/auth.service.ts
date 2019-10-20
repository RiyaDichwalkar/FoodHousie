import { Injectable, NgZone } from "@angular/core";
import { User } from "../shared/models/user";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  userData: any; // Save logged in user data
  isChef: boolean;
  isCustomer: boolean;
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /*Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.afs
          .collection("roles", ref => ref.where("uid", "==", user.uid))
          .valueChanges()
          .subscribe(val => {
            if (val["0"].role.localeCompare("chef") == 0) {
              this.isChef = true;
              this.isCustomer = false;
            } else {
              this.isCustomer = true;
              this.isChef = false;
            }
            var role = {
              isChef: this.isChef,
              isCustomer: this.isCustomer
            };
            if (this.isChef) {
              this.afs
                .collection("chef", ref => ref.where("uid", "==", user.uid))
                .valueChanges()
                .subscribe(val => {
                  this.userData = val["0"];
                  this.userData.emailVerified = user.emailVerified;
                  this.userData.role = "chef";
                  localStorage.setItem("user", JSON.stringify(this.userData));
                });
            } else {
              this.afs
                .collection("customer", ref => ref.where("uid", "==", user.uid))
                .valueChanges()
                .subscribe(val => {
                  this.userData = val["0"];
                  this.userData.emailVerified = user.emailVerified;
                  this.userData.role = "customer";
                  localStorage.setItem("user", JSON.stringify(this.userData));
                });
            }
            localStorage.setItem("roles", JSON.stringify(role));
          });
      } else {
        localStorage.setItem("user", null);
        localStorage.setItem("roles", null);
        JSON.parse(localStorage.getItem("user"));
        JSON.parse(localStorage.getItem("roles"));
      }
    });
  }

  SignIn(email, password) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(result => {
        //debugger;
        this.ngZone.run(() => {
          //debugger;
          this.router.navigate(["dashboard"]);
          console.log("Sign-in");
        });
      })
      .catch(error => {
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  SignUp(data) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(data.email, data.password)
      .then(cred => {
        this.SendVerificationMail();
        this.afs
          .collection("/roles")
          .doc(cred.user.uid)
          .set({ uid: cred.user.uid, role: data.role });
        if (data.role.localeCompare("customer") == 0) {
          return this.afs
            .collection("customer")
            .doc(cred.user.uid)
            .set({
              uid: cred.user.uid,
              fullname: data.fullName,
              role: data.role,
              email: data.email,
              mobile: data.mobile,
              address: data.address,
              pastorders: 0,
              latitude: data.latitude,
              longitude: data.longitude
            });
        } else {
          return this.afs
            .collection("chef")
            .doc(cred.user.uid)
            .set({
              uid: cred.user.uid,
              fullname: data.fullName,
              role: data.role,
              email: data.email,
              mobile: data.mobile,
              address: data.address,
              bio: "",
              photo:"",
              isKYCDone: false,
              latitude: data.latitude,
              longitude: data.longitude,
              totaldishsold: 0 //total number of dishes sold
            });
        }
      })
      .catch(error => {
        window.alert(error.message);
      });
  }

  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
      this.router.navigate(["verify-email-address"]);
    });
  }

  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert("Password reset email sent, check your inbox.");
      })
      .catch(error => {
        window.alert(error);
      });
  }

  getUserState() {
    return this.afAuth.authState;
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user"));
    return user !== null; // && user.emailVerified; //!== false ? true : false
  }

  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("roles");
      this.router.navigate(["sign-in"]);
    });
  }
}
