import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { GlobalParamsService } from '../global-params.service';
import { SendToPage } from '../send-to/send-to.page';
import { CommentRepliesPage } from '../comment-replies/comment-replies.page';

@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'],
})

export class ArticlePage implements OnInit {
  
  userHasRead: boolean;
  userHasShared: boolean;
  userHasFlagged: boolean;
  uid: string;
  displayName: string;
  photoUrl: string;
  title: string;
  publisher: string;
  publishDate: string;
  articleUrl: string;
  comment: string;
  titleID: string;
  image: string;
  content: string;
  description: string;
  reads;
  shares;
  flags;
  comments;
  commentLikes;
  commentReplies;
  followers;
  date: Date;
  currentTime: number;
  commentId: string;
  readCount: any;
  shareCount: any;
  flagCount: any;
  sendCount: any;
  commentCount: any;
  commentLikeCount: any;
  commentLikeCounts: any;
  commentReplyCounts: any;
  commentReplyCount: any;
  unLikeID: string;
  unLikeID1: any;
  shares1: any;
  shares2: any;
  shares3: any;
  unLikeID2: string;
  unLikeID3: string;
  unLikeID4: any;
  followerUnLike: any;
  unFlagshares1: any;
  unFlagshares2: any;
  unFlagshares3: any;
  unFlagID: string;
  unFlagID4: string;
  unFlagID3: string;
  unFlagID2: string;
  unFlagID1: string;
  likeCommentCheck: any;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              public route: ActivatedRoute,
              private afs: AngularFirestore,
              public toastController: ToastController,
              public modalController: ModalController,
              public iab: InAppBrowser,
              public globalProps: GlobalParamsService,
              public analytics: AngularFireAnalytics) {
                console.log(this.globalProps)
                this.title = this.globalProps.title;
                this.articleUrl = this.globalProps.articleUrl;
                this.publishDate = this.globalProps.publishDate;
                this.image = this.globalProps.image;
                this.content = this.globalProps.content;
                this.description = this.globalProps.description;
                this.publisher = this.globalProps.publisher;
                this.titleID = this.globalProps.titleID;
              }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        
        this.uid = user.uid;
        this.displayName = user.displayName;
        this.photoUrl = user.photoURL;

        this.readCount = this.afs.collection("articles").doc(this.titleID).collection("reads").valueChanges();
        
        this.reads = this.afs.collection("articles").doc(this.titleID).collection("reads").valueChanges()
          .subscribe(results => {
            for (let result of results) { 
              if (result.uid === this.uid) {
                  this.userHasRead = true;
              }
              else {
                this.userHasRead = false;
              }
              console.log("userhasread" + this.userHasRead);
            }
        });

        this.shareCount = this.afs.collection("articles").doc(this.titleID).collection("shares").valueChanges();
        
        this.shares = this.afs.collection("articles").doc(this.titleID).collection("shares").valueChanges({idField: 'likeID'})
          .subscribe(results => {
            for (let result of results) { 
              if (result.uid === this.uid) {
        
                this.unLikeID = result.likeID;
             
                this.userHasShared = true;
              }
              else {
                this.userHasShared = false;
              }
              console.log("userhasshared" + this.userHasRead);
            }
        });

        this.flagCount = this.afs.collection("articles").doc(this.titleID).collection("flags").valueChanges();
        
        this.flags = this.afs.collection("articles").doc(this.titleID).collection("flags").valueChanges({idField: 'flagID'})
            .subscribe(results => {
              for (let result of results) { 
                if (result.uid === this.uid) {
                    this.unFlagID = result.flagID;
                    this.userHasFlagged = true;
                }
                else {
                  this.userHasFlagged = false;
                }
                console.log("userhasflagged" + this.userHasRead);
              }
        });
          
        this.sendCount = this.afs.collection("articles").doc(this.titleID).collection("sends").valueChanges();

        this.commentCount = this.afs.collection("articles").doc(this.titleID).collection("comments").valueChanges();

        this.comments = this.afs.collection("articles").doc(this.titleID).collection("comments", 
          ref => ref.orderBy('createdAt', 'desc')).valueChanges({idField: 'commentID'})
            .subscribe(comments => this.comments = comments)
      }
    })
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }

   async presentModal() {
    if (this.userHasRead) { 
      const modal = await this.modalController.create({
        component: SendToPage,
        componentProps: {
          'title': this.title,
          'titleID': this.titleID,
          'articleUrl': this.articleUrl,
          'publishDate': this.publishDate,
          'publisher': this.publisher,
          'image': this.image,
          'description': this.description,
          'content': this.content
        }
      });
      return await modal.present();
    }
    else {
      this.presentToast("Articles must be read before they can be sent to someone");
    }
  }

  async openReplies($event, comment) {
      const modal = await this.modalController.create({
        component: CommentRepliesPage,
        componentProps: {
          comment: comment
        }
      });
      return await modal.present();
  }

  openArticle() {
    this.iab.create(this.articleUrl);
    this.userHasRead = true;
    this.date = new Date();
    this.currentTime = this.date.getTime();

    const shareRef1 = this.afs.collection("users").doc(this.uid).collection("reads");
      shareRef1.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), description: (this.description), content: (this.content),
        titleID: (this.titleID), readIsTrue: (true), articleUrl: (this.articleUrl), image: (this.image), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Read"))
          .catch((err)=> console.log("Read Error: " + err));

    const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("reads");
      shareRef3.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), description: (this.description), content: (this.content),
        titleID: (this.titleID), readIsTrue: (true), articleUrl: (this.articleUrl), image: (this.image), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Read"))
          .catch((err)=> console.log("Read Error: " + err));
  }

  openUser($event, comment) {
    this.router.navigateByUrl("tabs/" + this.globalProps.currentTab + "/user/" + comment.uid);
  }

  share() {
     if (this.userHasRead) {     

      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("shares");
        shareRef1.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl), description: (this.description), content: (this.content),
           titleID: (this.titleID), sharedIsTrue: (true), articleUrl: (this.articleUrl), image: (this.image), publishDate: (this.publishDate), publisher: (this.publisher) })
              .then(()=> console.log("Shared"))
              .catch((err)=> console.log("Shared Error: " + err));

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        shareRef2.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl), description: (this.description), content: (this.content),
          titleID: (this.titleID), sharedIsTrue: (true), articleUrl: (this.articleUrl), image: (this.image), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Shared"))
          .catch((err)=> console.log("Shared Error: " + err));

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
        shareRef5.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl), description: (this.description), content: (this.content),
          titleID: (this.titleID), sharedIsTrue: (true), articleUrl: (this.articleUrl), image: (this.image), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Shared"))
          .catch((err)=> console.log("Shared Error: " + err));

      const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("shares");
        shareRef3.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl), description: (this.description), content: (this.content),
          titleID: (this.titleID), sharedIsTrue: (true), articleUrl: (this.articleUrl), image: (this.image), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Shared"))
          .catch((err)=> console.log("Shared Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl), description: (this.description), content: (this.content),
            titleID: (this.titleID), sharedIsTrue: (true), articleUrl: (this.articleUrl), image: (this.image), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Shared to follower: " + result.followerUid))
          .catch((err)=> console.log("Shared Error: " + err));
        }
      })
      this.userHasShared = true;
      this.presentToast("Article liked");
    }

    else if (!this.userHasRead) {
      this.presentToast("Articles must be read before they can be liked");
    }
    else {
      this.presentToast("Articles must be read before they can be liked");
    }
   
  }

  unShare() {
    const unshareRef3 = this.afs.collection("articles").doc(this.titleID).collection("shares").doc(this.unLikeID);
    unshareRef3.delete().then(() => console.log("unliked"));

    this.shares1 = this.afs.collection("users").doc(this.uid).collection("shares").valueChanges({idField: 'likeID1'})
    .subscribe(results => {
      for (let result of results) { 
        if (result.titleID === this.titleID && result.sharedIsTrue === true) {
          
          this.unLikeID1 = result.likeID1;
          const unshareRef1 = this.afs.collection("users").doc(this.uid).collection("shares").doc(this.unLikeID1);
          unshareRef1.delete().then(() => console.log("unliked"));
        }
      }
    });
    this.shares2 = this.afs.collection("users").doc(this.uid).collection("publicActivity").valueChanges({idField: 'likeID2'})
    .subscribe(results => {
      for (let result of results) { 
        if (result.titleID === this.titleID && result.sharedIsTrue === true) {
          this.unLikeID2 = result.likeID2;
          const unshareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity").doc(this.unLikeID2);
          unshareRef2.delete().then(() => console.log("unliked"));
         
        }
      }
    });
    this.shares3 = this.afs.collection("users").doc(this.uid).collection("privateActivity").valueChanges({idField: 'likeID3'})
    .subscribe(results => {
      for (let result of results) { 
        if (result.titleID === this.titleID && result.sharedIsTrue === true) {

          this.unLikeID3 = result.likeID3;
          const unshareRef4 = this.afs.collection("users").doc(this.uid).collection("privateActivity").doc(this.unLikeID3);
          unshareRef4.delete().then(() => console.log("unliked"));
        }
      }
    });
    this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          this.followerUnLike = this.afs.collection("users").doc(result.followerUid).collection("followingActivity").valueChanges({idField: 'likeID4'});
          this.followerUnLike.subscribe(results1 => {
            for (let result1 of results1) {
              if (result1.titleID === this.titleID && result.sharedIsTrue === true) {
        
                this.unLikeID4 = result1.likeID4;
                const unshareRef5 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity").doc(this.unLikeID4);
                unshareRef5.delete().then(() => console.log("unliked"));
              }
            }
        })
      }
      });
    this.userHasShared = false;
    this.presentToast("Article unliked");
  }

  flag() {
    if (this.userHasRead) {
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const flagRef1 = this.afs.collection("users").doc(this.uid).collection("flags");
        flagRef1.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl), description: (this.description), content: (this.content),
          titleID: (this.titleID), flaggedIsTrue: (true), articleUrl: (this.articleUrl), image: (this.image), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Flagged"))
          .catch((err)=> console.log("Flagged Error: " + err));

      const flagRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        flagRef2.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl), description: (this.description), content: (this.content),
          titleID: (this.titleID), flaggedIsTrue: (true), articleUrl: (this.articleUrl), image: (this.image), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Flagged"))
          .catch((err)=> console.log("Flagged Error: " + err));

      const flagRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
        flagRef5.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl), description: (this.description), content: (this.content),
          titleID: (this.titleID), flaggedIsTrue: (true), articleUrl: (this.articleUrl), image: (this.image), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Flagged"))
          .catch((err)=> console.log("Flagged Error: " + err));

      const flagRef3 = this.afs.collection("articles").doc(this.titleID).collection("flags");
        flagRef3.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl), description: (this.description), content: (this.content),
          titleID: (this.titleID), flaggedIsTrue: (true), articleUrl: (this.articleUrl), image: (this.image), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Flagged"))
          .catch((err)=> console.log("Flagged Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const flagRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          flagRef4.add({ uid: (this.uid), displayName: (this.displayName), createdAt: (this.currentTime), title: (this.title), photoUrl: (this.photoUrl), description: (this.description), content: (this.content),
            titleID: (this.titleID), flaggedIsTrue: (true), articleUrl: (this.articleUrl), image: (this.image), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Flagged to follower: " + result.followerUid))
          .catch((err)=> console.log("Flagged Error: " + err));
        }
      })
      this.presentToast("Article flagged as narrative driven journalism");
      this.userHasFlagged = true;
    }
    else if (!this.userHasRead) {
      this.presentToast("Articles must be read before they can be flagged as narrative driven journalism");
    }
    else {
      this.presentToast("Articles must be read before they can be flagged as narrative driven journalism");
    }
  }

  unFlag() {
    const unFlagRef3 = this.afs.collection("articles").doc(this.titleID).collection("flags").doc(this.unFlagID);
    unFlagRef3.delete().then(() => console.log("unflaged"));

    this.unFlagshares1 = this.afs.collection("users").doc(this.uid).collection("flags").valueChanges({idField: 'flagID1'})
    .subscribe(results => {
      for (let result of results) { 
        if (result.titleID === this.titleID) {
          
          this.unFlagID1 = result.flagID1;
          const unFlagRef1 = this.afs.collection("users").doc(this.uid).collection("flags").doc(this.unFlagID1);
          unFlagRef1.delete().then(() => console.log("unflagged"));
        }
      }
    });
    this.unFlagshares2 = this.afs.collection("users").doc(this.uid).collection("publicActivity").valueChanges({idField: 'flagID2'})
    .subscribe(results => {
      for (let result of results) { 
        if (result.titleID === this.titleID) {
          this.unFlagID2 = result.flagID2;
          const unFlagRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity").doc(this.unFlagID2);
          unFlagRef2.delete().then(() => console.log("unflagged"));
         
        }
      }
    });
    this.unFlagshares3 = this.afs.collection("users").doc(this.uid).collection("privateActivity").valueChanges({idField: 'flagID3'})
    .subscribe(results => {
      for (let result of results) { 
        if (result.titleID === this.titleID) {

          this.unFlagID3 = result.flagID3;
          const unFlagRef4 = this.afs.collection("users").doc(this.uid).collection("privateActivity").doc(this.unFlagID3);
          unFlagRef4.delete().then(() => console.log("unflagged"));
        }
      }
    });
    this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          this.followerUnLike = this.afs.collection("users").doc(result.followerUid).collection("followingActivity").valueChanges({idField: 'flagID4'});
          this.followerUnLike.subscribe(results1 => {
            for (let result1 of results1) {
              if (result1.titleID === this.titleID) {
        
                this.unFlagID4 = result1.flagID4;
                const unFlagRef5 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity").doc(this.unFlagID4);
                unFlagRef5.delete().then(() => console.log("unflagged"));
              }
            }
        })
      }
      });
      this.userHasFlagged = false;
      this.presentToast("Article unflagged");
  }

  newComment() {
    if (this.userHasRead) {
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const shareRef1 = this.afs.collection("users").doc(this.uid).collection("comments");
        shareRef1.add({ uid: (this.uid), likesCount: (0), replyCount: (0), displayName: (this.displayName), photoUrl: (this.photoUrl), createdAt: (this.currentTime), title: (this.title), comment: (this.comment), description: (this.description), content: (this.content),
          titleID: (this.titleID), commentIsTrue: (true), articleUrl: (this.articleUrl), image: (this.image), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Comment"))
          .catch((err)=> console.log("Comment Error: " + err));

      const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
        shareRef2.add({ uid: (this.uid), likesCount: (0), replyCount: (0), displayName: (this.displayName), photoUrl: (this.photoUrl), createdAt: (this.currentTime), title: (this.title), comment: (this.comment), description: (this.description), content: (this.content),
          titleID: (this.titleID), commentIsTrue: (true), articleUrl: (this.articleUrl), image: (this.image), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Comment"))
          .catch((err)=> console.log("Comment Error: " + err));

      const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
      shareRef5.add({ uid: (this.uid), likesCount: (0), replyCount: (0), displayName: (this.displayName), photoUrl: (this.photoUrl), createdAt: (this.currentTime), title: (this.title), comment: (this.comment), description: (this.description), content: (this.content),
        titleID: (this.titleID), commentIsTrue: (true), articleUrl: (this.articleUrl), image: (this.image), publishDate: (this.publishDate), publisher: (this.publisher) })
        .then(()=> console.log("Comment"))
          .catch((err)=> console.log("Comment Error: " + err));

      const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("comments");
        shareRef3.add({ uid: (this.uid), likesCount: (0), replyCount: (0), displayName: (this.displayName), photoUrl: (this.photoUrl), createdAt: (this.currentTime), title: (this.title), comment: (this.comment), description: (this.description), content: (this.content),
          titleID: (this.titleID), commentIsTrue: (true), articleUrl: (this.articleUrl), image: (this.image), publishDate: (this.publishDate), publisher: (this.publisher) })
          .then(()=> console.log("Comment"))
          .catch((err)=> console.log("Comment Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          shareRef4.add({ uid: (this.uid), likesCount: (0), replyCount: (0), displayName: (this.displayName), photoUrl: (this.photoUrl), createdAt: (this.currentTime), title: (this.title), comment: (this.comment), description: (this.description), content: (this.content),
            titleID: (this.titleID), commentIsTrue: (true), articleUrl: (this.articleUrl), image: (this.image), publishDate: (this.publishDate), publisher: (this.publisher) })
            .then(()=> console.log("Comment to follower: " + result.followerUid))
          .catch((err)=> console.log("Comment Error: " + err));
        }
      })
      this.presentToast("Comment posted!");
    }
    else if (!this.userHasRead) {
      this.presentToast("Articles must be read before they can be commented on");
    }
    else {
      this.presentToast("Articles must be read before they can be commented on");
    }
    
    
  }

  deleteComment() {
    
  }

  likeComment($event, comment) {

    if (!this.userHasRead) {
      this.presentToast("Articles must be read before comments can be liked");
    }
    
    else if (this.userHasRead) {

      console.log('else')

      this.likeCommentCheck = this.afs.collection("users").doc(this.uid).collection("likedComments").valueChanges({idField: 'commentlikeID'})
      .subscribe(results => {
        console.log(results)
        if (results.length > 0) {
          for (let result of results) { 
            console.log(result)
            if (result.commentlikeID === comment.commentID && result.comment === comment.comment) {
              console.log("comment already liked")
            }
            else {

              console.log("commentLike event & comment data: " + $event, comment);
              this.date = new Date();
              this.currentTime = this.date.getTime();
        
              let likes = comment.likesCount;
              let newLikes = likes + 1;
        
              const shareRef1 = this.afs.collection("users").doc(this.uid).collection("likedComments");
                shareRef1.add({ uid: (this.uid), likesCount: (newLikes), replyCount: (comment.replyCount), photoUrl: (this.photoUrl), publishDate: (this.publishDate), 
                  publisher: (this.publisher), displayName: (this.displayName), comment: (comment.comment), createdAt: (this.currentTime), 
                  title: (this.title), titleID: (this.titleID), docID: (comment.commentID), image: (this.image), likedCommentIsTrue: (true), description: (this.description), 
                  content: (this.content), authorUid: (comment.uid), authorDisplayName: (comment.displayName), authorPhotoUrl: (comment.photoUrl) })
                  .then(()=> console.log("Like Comment"))
                  .catch((err)=> console.log(" LikeComment Error: " + err));
        
              const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
                shareRef2.add({ uid: (this.uid), likesCount: (newLikes), replyCount: (comment.replyCount), photoUrl: (this.photoUrl), publishDate: (this.publishDate), 
                  publisher: (this.publisher), displayName: (this.displayName), comment: (comment.comment), createdAt: (this.currentTime), 
                  title: (this.title), titleID: (this.titleID), docID: (comment.commentID), description: (this.description), image: (this.image), content: (this.content), 
                  likedCommentIsTrue: (true), authorUid: (comment.uid), authorDisplayName: (comment.displayName), authorPhotoUrl: (comment.photoUrl) })
                  .then(()=> console.log("Like Comment"))
                  .catch((err)=> console.log(" LikeComment Error: " + err));
        
              const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
                shareRef5.add({ uid: (this.uid), likesCount: (newLikes), replyCount: (comment.replyCount), photoUrl: (this.photoUrl), publishDate: (this.publishDate), 
                  publisher: (this.publisher), displayName: (this.displayName), comment: (comment.comment), createdAt: (this.currentTime), 
                  title: (this.title), titleID: (this.titleID), docID: (comment.commentID), description: (this.description), image: (this.image), content: (this.content), 
                  likedCommentIsTrue: (true), authorUid: (comment.uid), authorDisplayName: (comment.displayName), authorPhotoUrl: (comment.photoUrl) })
                  .then(()=> console.log("Like Comment"))
                  .catch((err)=> console.log(" LikeComment Error: " + err));
        
              const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("comments").doc(comment.commentID).collection("commentLikes");
                                                                      
                shareRef3.add({ uid: (this.uid), likesCount: (newLikes), replyCount: (comment.replyCount), photoUrl: (this.photoUrl), publishDate: (this.publishDate), 
                  publisher: (this.publisher), displayName: (this.displayName), comment: (comment.comment), createdAt: (this.currentTime), 
                  title: (this.title), titleID: (this.titleID), docID: (comment.commentID), description: (this.description), image: (this.image), content: (this.content), 
                  likedCommentIsTrue: (true), authorUid: (comment.uid), authorDisplayName: (comment.displayName), authorPhotoUrl: (comment.photoUrl) })
                  .then(()=> console.log("Like Comment"))
                  .catch((err)=> console.log(" LikeComment Error: " + err));
              
              const shareRef7 = this.afs.collection("articles").doc(this.titleID).collection("comments").doc(comment.commentID);
              shareRef7.update({ likesCount: (newLikes)})
        
              this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
              this.followers.subscribe(results => {
                for (let result of results) { 
                  const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
                  shareRef4.add({ uid: (this.uid), likesCount: (newLikes), replyCount: (comment.replyCount), photoUrl: (this.photoUrl), publishDate: (this.publishDate), 
                    publisher: (this.publisher), displayName: (this.displayName), comment: (comment.comment), createdAt: (this.currentTime), 
                    title: (this.title), titleID: (this.titleID), docID: (comment.commentID), description: (this.description), image: (this.image), content: (this.content), 
                    likedCommentIsTrue: (true), authorUid: (comment.uid), authorDisplayName: (comment.displayName), authorPhotoUrl: (comment.photoUrl) })
                    .then(()=> console.log("Like Comment"))
                  .catch((err)=> console.log(" LikeComment Error: " + err));
                }
              })
              this.presentToast("Comment Liked!");
            }
          }
        }
        else {

          console.log("commentLike event & comment data: " + $event, comment);
          this.date = new Date();
          this.currentTime = this.date.getTime();
    
          let likes = comment.likesCount;
          let newLikes = likes + 1;
    
          const shareRef1 = this.afs.collection("users").doc(this.uid).collection("likedComments");
            shareRef1.add({ uid: (this.uid), likesCount: (newLikes), replyCount: (comment.replyCount), photoUrl: (this.photoUrl), publishDate: (this.publishDate), 
              publisher: (this.publisher), displayName: (this.displayName), comment: (comment.comment), createdAt: (this.currentTime), 
              title: (this.title), titleID: (this.titleID), docID: (comment.commentID), image: (this.image), likedCommentIsTrue: (true), description: (this.description), 
              content: (this.content), authorUid: (comment.uid), authorDisplayName: (comment.displayName), authorPhotoUrl: (comment.photoUrl) })
              .then(()=> console.log("Like Comment"))
              .catch((err)=> console.log(" LikeComment Error: " + err));
    
          const shareRef2 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
            shareRef2.add({ uid: (this.uid), likesCount: (newLikes), replyCount: (comment.replyCount), photoUrl: (this.photoUrl), publishDate: (this.publishDate), 
              publisher: (this.publisher), displayName: (this.displayName), comment: (comment.comment), createdAt: (this.currentTime), 
              title: (this.title), titleID: (this.titleID), docID: (comment.commentID), description: (this.description), image: (this.image), content: (this.content), 
              likedCommentIsTrue: (true), authorUid: (comment.uid), authorDisplayName: (comment.displayName), authorPhotoUrl: (comment.photoUrl) })
              .then(()=> console.log("Like Comment"))
              .catch((err)=> console.log(" LikeComment Error: " + err));
    
          const shareRef5 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
            shareRef5.add({ uid: (this.uid), likesCount: (newLikes), replyCount: (comment.replyCount), photoUrl: (this.photoUrl), publishDate: (this.publishDate), 
              publisher: (this.publisher), displayName: (this.displayName), comment: (comment.comment), createdAt: (this.currentTime), 
              title: (this.title), titleID: (this.titleID), docID: (comment.commentID), description: (this.description), image: (this.image), content: (this.content), 
              likedCommentIsTrue: (true), authorUid: (comment.uid), authorDisplayName: (comment.displayName), authorPhotoUrl: (comment.photoUrl) })
              .then(()=> console.log("Like Comment"))
              .catch((err)=> console.log(" LikeComment Error: " + err));
    
          const shareRef3 = this.afs.collection("articles").doc(this.titleID).collection("comments").doc(comment.commentID).collection("commentLikes");
                                                                  
            shareRef3.add({ uid: (this.uid), likesCount: (newLikes), replyCount: (comment.replyCount), photoUrl: (this.photoUrl), publishDate: (this.publishDate), 
              publisher: (this.publisher), displayName: (this.displayName), comment: (comment.comment), createdAt: (this.currentTime), 
              title: (this.title), titleID: (this.titleID), docID: (comment.commentID), description: (this.description), image: (this.image), content: (this.content), 
              likedCommentIsTrue: (true), authorUid: (comment.uid), authorDisplayName: (comment.displayName), authorPhotoUrl: (comment.photoUrl) })
              .then(()=> console.log("Like Comment"))
              .catch((err)=> console.log(" LikeComment Error: " + err));
          
          const shareRef7 = this.afs.collection("articles").doc(this.titleID).collection("comments").doc(comment.commentID);
          shareRef7.update({ likesCount: (newLikes)})
    
          this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
          this.followers.subscribe(results => {
            for (let result of results) { 
              const shareRef4 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
              shareRef4.add({ uid: (this.uid), likesCount: (newLikes), replyCount: (comment.replyCount), photoUrl: (this.photoUrl), publishDate: (this.publishDate), 
                publisher: (this.publisher), displayName: (this.displayName), comment: (comment.comment), createdAt: (this.currentTime), 
                title: (this.title), titleID: (this.titleID), docID: (comment.commentID), description: (this.description), image: (this.image), content: (this.content), 
                likedCommentIsTrue: (true), authorUid: (comment.uid), authorDisplayName: (comment.displayName), authorPhotoUrl: (comment.photoUrl) })
                .then(()=> console.log("Like Comment"))
              .catch((err)=> console.log(" LikeComment Error: " + err));
            }
          })
          this.presentToast("Comment Liked!");
        }

      })
      }
  }
}