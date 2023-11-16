import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { TweetInterface } from 'src/app/interface/tweet.interface';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { identity, throwError } from 'rxjs';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  AllTweets: TweetInterface[] = [];
  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navigation: NavController
  ) {}

  async deleteToken() {
    await Preferences.remove({ key: 'token' });
  }

  async ngOnInit() {
    const id = await Preferences.get({ key: 'tweetId' });
    this.http
      .get(`https://funaticsbackend-production.up.railway.app/funa/get/${id}`)
      .pipe(
        catchError((error) => {
          console.log(error.status);
          if (error.status == 500) {
            console.log('hola');
            this.deleteToken();
            this.alert
              .create({
                header: 'Session terminated',
                message: 'Please login again',
                buttons: ['OK'],
              })
              .then((alert) => alert.present());
            this.navigation.navigateForward('/login');
          } else if (error.status == 401) {
            this.alert
              .create({
                header: 'Unauthorized',
                message: 'Please login to see this page',
                buttons: ['OK'],
              })
              .then((alert) => alert.present());
            this.navigation.navigateForward('/login');
          }
          return throwError(error);
        })
      )
      .subscribe((res: any) => {
        console.log(res);
        this.AllTweets = res.tweets;
      });
  }
}
