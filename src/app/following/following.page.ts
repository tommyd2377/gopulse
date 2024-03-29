import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalParamsService } from '../global-params.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-following',
  templateUrl: './following.page.html',
  styleUrls: ['./following.page.scss'],
})

export class FollowingPage implements OnInit {

  uid: string;
  following;

  constructor(private fireAuth: AngularFireAuth,
              private afs: AngularFirestore,
              public router: Router,
              public globalProps: GlobalParamsService) { } 

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
        this.following = this.afs.collection("users").doc(this.uid).collection("following").valueChanges();
      }
    })
  } 

  openUser($event, followee) {
    this.router.navigateByUrl("tabs/" + this.globalProps.currentTab + "/user/" + followee.followeeUid);
  }

}
