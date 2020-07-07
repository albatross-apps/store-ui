import React, { memo, Fragment } from "react"
import {
  IonRow,
  IonCol,
  IonIcon,
  IonNote,
  IonRouterLink,
  IonFabButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
} from "@ionic/react"
import { PWA } from "../../util/types"
import { PWACard } from ".."
import { arrowForward } from "ionicons/icons"
import "./styles.css"
import { GetPwaCategoryUrl } from "../../routes"

interface ContainerProps {
  pwas: PWA[]
  linkTo: string
  isLoading: boolean
  title: string
  subtitle: string
}

const HomeRow: React.FC<ContainerProps> = ({
  pwas,
  linkTo,
  title,
  subtitle,
}) => {
  return (
    <IonCard className="line-around">
      <IonCardHeader>
        <div className="HomeRowHeader">
          <h1 className="HomeRowHeaderTitle">{title}</h1>
          <IonFabButton
            className="HomeViewMoreLink"
            routerLink={GetPwaCategoryUrl(linkTo)}
          >
            <IonIcon color="dark" icon={arrowForward} />
          </IonFabButton>
        </div>
        <IonNote className="HomeRowHeaderSubTitle">{subtitle}</IonNote>
      </IonCardHeader>
      <IonCardContent>
        <IonRow className="HomeRow">
          {pwas.map((topApp, i) => (
            <IonCol key={i} size="6" sizeMd="4" sizeLg="3">
              <PWACard url="/pwa" pwa={topApp} isMyPwa={false} />
            </IonCol>
          ))}
        </IonRow>
      </IonCardContent>
    </IonCard>
  )
}

export default memo(HomeRow)
