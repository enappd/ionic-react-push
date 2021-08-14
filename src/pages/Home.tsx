/*
* Ionic React Capacitor Full App (https://store.enappd.com/product/ionic-react-full-app-capacitor/)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/
import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonFooter, IonList, IonCard, IonCardContent, IonItem, IonLabel, IonListHeader, IonText, IonButtons, IonMenuButton } from '@ionic/react';
import { PushNotificationSchema, PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import './Home.css';
import { Toast } from "@capacitor/toast";

export default function PushNotificationsContainer() {
    const nullEntry: any[] = []
    const [notifications, setnotifications] = useState(nullEntry);

    useEffect(()=>{
        PushNotifications.checkPermissions().then((res) => {
            console.log(res);
            if (res.receive !== 'granted') {
              PushNotifications.requestPermissions().then((res) => {
                if (res.receive === 'denied') {
                  showToast('Push Notification permission denied');
                }
                else {
                  showToast('Push Notification permission granted');
                  register();
                }
              });
            }
            else {
              register();
            }
          });
    },[])
    
    const register = () => {
        console.log('Initializing HomePage');

        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();

        // On success, we should be able to receive notifications
        PushNotifications.addListener('registration',
            (token: Token) => {
                console.log('Push registration success, token: ' + token.value)
                showToast('Push registration success');
                alert('Push registration success, token: ' + token.value);
            }
        );

        // Some issue with our setup and push will not work
        PushNotifications.addListener('registrationError',
            (error: any) => {
                console.log('Error on registration: ' + JSON.stringify(error))
                alert('Error on registration: ' + JSON.stringify(error));
            }
        );

        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener('pushNotificationReceived',
            (notification: PushNotificationSchema) => {
                console.log('Push received: ' + JSON.stringify(notification))
                setnotifications(notifications => [...notifications, { id: notification.id, title: notification.title, body: notification.body, type: 'foreground' }])
            }
        );

        // Method called when tapping on a notification
        PushNotifications.addListener('pushNotificationActionPerformed',
            (notification: ActionPerformed) => {
                console.log('Push action performed: ' + JSON.stringify(notification))
                setnotifications(notifications => [...notifications, { id: notification.notification.data.id, title: notification.notification.data.title, body: notification.notification.data.body, type: 'action'  }])
            }
        );
    }

    const showToast = async (msg: string) => {
        await Toast.show({
            text: msg
        })
    }

    return (
        <IonPage id='main'>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle slot="start"> Push Notifications</IonTitle>
                </IonToolbar>
                <IonToolbar color="light">
                    <IonTitle slot="start">By Enappd Team</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div>
                    <IonList>
                        <IonCard>
                            <IonCardContent>
                                1. Register for Push by clicking the footer button.<br></br>
                                2. Once registered, you can send push from the Firebase console. <br></br>
                                <a href="https://enappd.gitbook.io/ionic-5-react-capacitor-full-app/features/push-notifications" target="_blank">Check documentation</a><br></br>
                                3. Once your app receives notifications, you'll see the data here in the list
                            </IonCardContent>
                        </IonCard>
                    </IonList>

                </div>
                <IonListHeader mode="ios" lines="full">
                    <IonLabel>Notifications</IonLabel>
                </IonListHeader>
                {notifications.length !== 0 &&
                    <IonList>

                        {notifications.map((notif: any) =>
                            <IonItem key={notif.id}>
                                <IonLabel>
                                    <IonText>
                                        <h3 className="notif-title">{notif.title}</h3>
                                    </IonText>
                                    <p>{notif.body}</p>
                                    {notif.type==='foreground' && <p>This data was received in foreground</p>}
                                    {notif.type==='action' && <p>This data was received on tap</p>}
                                </IonLabel>
                            </IonItem>
                        )}
                    </IonList>}
            </IonContent>
            <IonFooter>
                <IonToolbar>
                    <IonButton color="success" expand="full" onClick={register}>Register for Push</IonButton>
                </IonToolbar>
            </IonFooter>
        </IonPage >
    )
}



