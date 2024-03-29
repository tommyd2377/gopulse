import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, Platform, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalParamsService } from '../global-params.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})

export class UserPage implements OnInit {

  @ViewChild(IonContent, {static: true}) content: IonContent;

  backToTop: boolean = false;

  showLoader: boolean = true;

  thisIsYou: boolean;
  userIsFollowing: boolean;
  uid: string;
  displayName: string;
  userId: string;
  userDisplayName: string;
  followers;
  yourfollowers;
  following;
  cuFollowing;
  date: Date;
  currentTime: number;
  userProfileDoc;
  userdoc;
  userActivity;
  photoUrl;
  userPhotoUrl;
  parentTab;
  unFollowID: string;
  unFollow1: any;
  unFollow2: any;
  unFollow3: any;
  followerunFollow: any;
  unFollowID4: any;
  unFollowID2: string;
  unFollowID1: string;
  unFollowID3: string;
  unFollow6: any;
  unFollowID6: string;
  unFollow7: any;
  unFollowID7: any;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              public platform: Platform,
              public route: ActivatedRoute,
              private afs: AngularFirestore,
              public globalProps: GlobalParamsService,
              public toastController: ToastController) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
 
        this.uid = user.uid;
        this.displayName = user.displayName;
        this.photoUrl = user.photoURL;
        
        this.userId = this.route.snapshot.paramMap.get('id');

        if (this.uid === this.userId) {
          this.thisIsYou = true;
        }
        else {
          this.thisIsYou = false;
        }

        this.cuFollowing = this.afs.collection("users").doc(this.uid).collection("following").valueChanges({idField: 'followID'})
          .subscribe(results => {
            for (let result of results) { 
              if (result.followeeUid === this.userId && result.followerUid === this.uid) {
                  this.userIsFollowing = true;
                  this.unFollowID = result.followID;
                  break;
              }
              else {
                this.userIsFollowing = false;
              }
            }
          })

        this.userProfileDoc = this.afs.collection("users").doc(this.userId).valueChanges();

        this.userdoc = this.afs.collection("users").doc(this.userId).ref.get().then((doc) => {
          if (doc.exists) {
            this.userDisplayName = doc.data().displayName;
            this.userPhotoUrl = doc.data().photoURL;


          } else {
            this.presentToast("No such document!");
          }
        }).catch(function(error) {
          this.presentToast("Error getting document:", error);
        });

        this.userActivity = this.afs.collection("users").doc(this.userId).collection("publicActivity", ref => 
          ref.orderBy('createdAt', 'desc')).valueChanges();
        
        this.followers = this.afs.collection("users").doc(this.userId).collection("followers").valueChanges();
        
        this.following = this.afs.collection("users").doc(this.userId).collection("following").valueChanges();
      }
    })
    this.showLoader = false;
  }

  getScrollPos(pos: number) {
    if (pos > this.platform.height()) {
         this.backToTop = true;
    } else {
         this.backToTop = false;
    }
  }

  gotToTop() {
    this.content.scrollToTop(500);
  }
 
  openArticle($event, active) {
    this.globalProps.title = active.title;
    this.globalProps.articleUrl = active.articleUrl;
    this.globalProps.publishDate = active.publishDate;
    this.globalProps.publisher = active.publisher;
    this.globalProps.image = active.image;
    this.globalProps.description = active.description;
    this.globalProps.content = active.content;
    this.globalProps.titleID = active.titleID;
    this.router.navigateByUrl('tabs/' + this.globalProps.currentTab + '/article/' + this.globalProps.titleID);
  }

  openUser($event, active) {
    this.router.navigateByUrl('tabs/' + this.globalProps.currentTab + '/user/' + active.uid);
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }

  follow() {   
    if (!this.userIsFollowing) {
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const followRef1 = this.afs.collection("users").doc(this.userId).collection("followers");
        followRef1.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
          followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followedIsTrue: (true) })

      const followRef2 = this.afs.collection("users").doc(this.userId).collection("publicActivity");
      followRef2.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
        followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followedIsTrue: (true) })
      
      const followRef7 = this.afs.collection("users").doc(this.userId).collection("privateActivity");
      followRef7.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
        followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followedIsTrue: (true) })
                      
      const followRef3 = this.afs.collection("users").doc(this.uid).collection("following");
      followRef3.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
        followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followingIsTrue: (true) })

      const followRef4 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
      followRef4.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
        followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followingIsTrue: (true) })

      const followRef6 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
      followRef6.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
        followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followingIsTrue: (true) })

      this.yourfollowers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.yourfollowers.subscribe(results => {
        for (let result of results) { 
          const followRef5 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          followRef5.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
            followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followingIsTrue: (true) })
        }
      })
      this.userIsFollowing = true;
      this.followers = this.afs.collection("users").doc(this.userId).collection("followers").valueChanges();
      this.presentToast("You are now following " + this.userDisplayName);
    }
  }

  unFollow() {
    if (this.userIsFollowing) {

      const unFollowRef = this.afs.collection("users").doc(this.uid).collection("following").doc(this.unFollowID);
        unFollowRef.delete();

      this.unFollow1 = this.afs.collection("users").doc(this.uid).collection("publicActivity").valueChanges({idField: 'unFollowID1'})
        .subscribe(results => {
          for (let result of results) { 
            if (result.followeeUid === this.userId && result.followerUid === this.uid) {
              this.unFollowID1 = result.unFollowID1;
              const unFollowRef1 = this.afs.collection("users").doc(this.uid).collection("publicActivity").doc(this.unFollowID1);
              unFollowRef1.delete();
              break;
            }
          }
      });

      this.unFollow6 = this.afs.collection("users").doc(this.uid).collection("privateActivity").valueChanges({idField: 'unFollowID6'})
        .subscribe(results => {
          for (let result of results) { 
            if (result.followeeUid === this.userId && result.followerUid === this.uid) {
              this.unFollowID6 = result.unFollowID6;
              const unFollowRef6 = this.afs.collection("users").doc(this.uid).collection("privateActivity").doc(this.unFollowID6);
              unFollowRef6.delete();
              break;
            }
          }
      });
      
      this.unFollow2 = this.afs.collection("users").doc(this.userId).collection("publicActivity").valueChanges({idField: 'unFollowID2'})
      .subscribe(results => {
        for (let result of results) { 
          if (result.followeeUid === this.userId && result.followerUid === this.uid) {
            this.unFollowID2 = result.unFollowID2;
            const unFollowRef2 = this.afs.collection("users").doc(this.userId).collection("publicActivity").doc(this.unFollowID2);
            unFollowRef2.delete();
            break;
          }
        }
      });

      this.unFollow3 = this.afs.collection("users").doc(this.userId).collection("privateActivity").valueChanges({idField: 'unFollowID3'})
      .subscribe(results => {
        for (let result of results) { 
          if (result.followeeUid === this.userId && result.followerUid === this.uid) {
            this.unFollowID3 = result.unFollowID3;
            const unFollowRef4 = this.afs.collection("users").doc(this.userId).collection("privateActivity").doc(this.unFollowID3);
            unFollowRef4.delete();
            break;
          }
        }
      });

      this.unFollow7 = this.afs.collection("users").doc(this.userId).collection("followers").valueChanges({idField: 'unFollowID7'})
      .subscribe(results => {
        for (let result of results) { 
          if (result.followeeUid === this.userId && result.followerUid === this.uid) {
            this.unFollowID7 = result.unFollowID7;
            const unFollowRef4 = this.afs.collection("users").doc(this.userId).collection("followers").doc(this.unFollowID7);
            unFollowRef4.delete();
            break;
          }
        }
      });

      this.yourfollowers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
        this.yourfollowers.subscribe(results => {
          for (let result of results) { 
            this.followerunFollow = this.afs.collection("users").doc(result.followerUid).collection("followingActivity").valueChanges({idField: 'unFollowID4'});
            this.followerunFollow.subscribe(results1 => {
              for (let result1 of results1) {
                if (result1.followeeUid === this.userId && result1.followerUid === this.uid) {
                  this.unFollowID4 = result1.unFollowID4;
                  const unFollowRef5 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity").doc(this.unFollowID4);
                  unFollowRef5.delete();
                  break;
                }
              }
          })
        }
      });
      this.userIsFollowing = false;
      this.followers = this.afs.collection("users").doc(this.userId).collection("followers").valueChanges();
      this.presentToast("You are no longer following " + this.userDisplayName);
    }
  }

  goToFollowers() {
    this.globalProps.userId = this.userId;
    this.router.navigateByUrl('tabs/' + this.globalProps.currentTab + '/user/' + this.userId + '/user-followers');
  }

  goToFollowing() {
    this.globalProps.userId = this.userId;
    this.router.navigateByUrl('tabs/' + this.globalProps.currentTab + '/user/' + this.userId + '/user-following');
  }

}