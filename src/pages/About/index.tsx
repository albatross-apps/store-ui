import React, { memo } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRouterLink,
  IonButtons,
  IonBackButton,
  IonFooter,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react"

const styles = {
  row: { color: "rgb(153, 153, 153)" },
  label: { fontSize: "30px", color: "black" },
  divider: { padding: 0, background: "inherit" },
}

const About: React.FC = () => (
  <IonPage>
    <IonHeader className="ion-no-border bottom-line-border">
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/home" />
        </IonButtons>
        <IonTitle>Contact Information</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="content">
      <IonCard className="line-around">
        <IonCardHeader>
          <IonCardTitle>
            <IonRouterLink routerLink="/dev/mattruddy">
              Matthew Ruddy
            </IonRouterLink>
          </IonCardTitle>
          <a href="mailto:mjruddy94@gmail.com">
            mjruddy94@gmail.com
          </a>
        </IonCardHeader>
        <IonCardContent>
          <img
            alt="mattruddyimg"
            style={{ borderRadius: "6px" }}
            height="180px"
            width="140px"
            src="/assets/selfies/matt.png"
          />
        </IonCardContent>
      </IonCard>
      <IonCard className="line-around">
        <IonCardHeader>
          <IonCardTitle>
            <IonRouterLink routerLink="/dev/energy_apple">
              Adam Geiger
            </IonRouterLink>
          </IonCardTitle>
          <a href="mailto:ajg5629@gmail.com">ajg5629@gmail.com</a>
        </IonCardHeader>
        <IonCardContent>
          <img
            alt="agimg"
            style={{ borderRadius: "6px" }}
            height="140px"
            width="140px"
            src="/assets/selfies/adam.jpg"
          />
        </IonCardContent>
      </IonCard>
    </IonContent>
    <IonFooter className="ion-no-border">
      <p style={{ padding: "8px" }}>&copy; 2020 Progressive App Store</p>
    </IonFooter>
  </IonPage>
)

export default memo(About)
