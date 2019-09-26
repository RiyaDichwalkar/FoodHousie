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
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        //console.log(user);
        this.userData = user;
        this.afs
          .collection("roles", ref => ref.where("uid", "==", user.uid))
          .valueChanges()
          .subscribe(val => {
            this.userData.role = val["0"].role;
            console.log(this.userData.role);
            if (val["0"].role.localeCompare("chef") == 0) {
              this.isChef = true;
              this.isCustomer = false;
            } else {
              this.isCustomer = true;
              this.isChef = false;
            }
            var role = 
           {
              'isChef': this.isChef,
            'isCustomer': this.isCustomer
           };
           localStorage.setItem('roles', JSON.stringify(role));
            localStorage.setItem("user", JSON.stringify(this.userData));
            console.log(this.userData.role + "is role");
            //console.log(localStorage.getItem("user").role);
          });
      } else {
        localStorage.setItem("user", null);
        JSON.parse(localStorage.getItem("user"));
      }
    });
  }

  // Sign in with email/password
  SignIn(email, password) {
    //console.log(email, password);
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(result => {
        this.ngZone.run(() => {
          this.router.navigate(["dashboard"]);
        });
        console.log("error");
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
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
        console.log(data.role);
        this.afs
          .collection("/roles")
          .doc(cred.user.uid)
          .set({ uid: cred.user.uid, roles: data.role });
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
              isKYCDone: false,
              latitude: data.latitude,
              longitude: data.longitude,
              chefPosts: "" //doubtful whether to make recipe here or just recipe ids!
            });
        }
      })
      .catch(error => {
        window.alert(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
      this.router.navigate(["verify-email-address"]);
    });
  }

  // Reset Forggot password
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
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem("user"));
    return user !== null; // && user.emailVerified; //!== false ? true : false
  }

  // Sign out
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem("user");
      this.router.navigate(["sign-in"]);
    });
  }


    getRole(){
     // debugger;
      this.afAuth.authState.subscribe(user => {
       // debugger;
        if (user) {
          //console.log(user);
          this.userData = user;
          this.afs
            .collection("roles", ref => ref.where("uid", "==", user.uid))
            .valueChanges()
            .subscribe(val => {
              this.userData.role = val["0"].role;
              console.log(this.userData.role);
              if (val["0"].role.localeCompare("chef") == 0) {
                //debugger;
                this.isChef = true;
                this.isCustomer = false;
              } else {
               // debugger;
                this.isCustomer = true;
                this.isChef = false;
              }
              //localStorage.setItem("user", JSON.stringify(this.userData));
              console.log(this.userData.role + "is role");
              //console.log(localStorage.getItem("user").role);
            });
        } else {
         console.log("null");
          //localStorage.setItem("user", null);
          //JSON.parse(localStorage.getItem("user"));
        }
      });
    }



}
