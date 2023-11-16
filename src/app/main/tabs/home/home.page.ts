import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { TweetInterface } from 'src/app/interface/tweet.interface';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NavController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  constructor(
    private http: HttpClient,
    private alert: AlertController,
    private navigation: NavController,
    private actionSheetCtrl: ActionSheetController
    ) {}

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          data: {
            action: 'delete',
          },
        },
        {
          text: 'Edit',
          role: 'modification',
          data: {
            action: 'Edit',
          },
        },
      ],
    });

    await actionSheet.present();
  }




  AllTweets: TweetInterface[] = [];

  // items = [
  //   {
  //     img: 'https://estaticos-cdn.sport.es/clip/0c9177bb-182c-4db2-9663-d5e01821f9a9_alta-libre-aspect-ratio_default_0.jpg',
  //     user: 'AndresAl',
  //     username: 'radsylph',
  //     date: '12345678',
  //     twitt:
  //       'diegoarf + Juan Romero. pasen videito cuando tengan relaciones, necesito porno de calidad',
  //     images:
  //       'https://dx35vtwkllhj9.cloudfront.net/universalstudios/bros/images/regions/ca/updates/onesheet.jpg',
  //   },
  //   {
  //     img: 'https://pbs.twimg.com/media/F-MPEnqWoAAP-ce?format=jpg&name=small',
  //     user: 'Bruh.mp4',
  //     username: 'nohayluz52',
  //     date: '12345678',
  //     twitt: '- Le mostraste tu última imagen a pomni.\n - ¿¿Que es.??',
  //     images:
  //       'https://pbs.twimg.com/media/F-LiipQWUAAFcVx?format=jpg&name=small',
  //   },

  //   {
  //     img: 'https://www.rollingstone.com/wp-content/uploads/2020/01/SturgillSimpson.jpg',
  //     user: 'NyxDuodecim',
  //     username: 'Nautico00',
  //     date: '12345678',
  //     twitt: 'BombRushCyberfunk',
  //     images:
  //       'https://pbs.twimg.com/media/F5S34BjWsAECmiz?format=jpg&name=large',
  //   },
  // ];



  // async checkToken() {
  //   const { value } = await Preferences.get({ key: 'token' });
  //   console.log(`this is the token ${value}`);
  // }



  async deleteToken() {
    await Preferences.remove({ key: 'token' });
  }
  async ngOnInit() {
    this.http
      .get('https://funaticsbackend-production.up.railway.app/funa/get')
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

  async test(_id: string) {
    console.log(_id);
    await Preferences.set({ key: 'tweetId', value: _id });
    console.log('hola');
  }
}
