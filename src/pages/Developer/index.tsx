import React, { memo, useMemo, useState, useCallback, useEffect } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRow,
  IonButtons,
  IonCol,
  IonBackButton,
  useIonViewDidEnter,
} from "@ionic/react"
import { useParams } from "react-router"
import ProfileCard from "../../components/ProfileCard"
import { mdConverter } from "../../util"
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { thunkGetDev } from "../../redux/PWAs/actions"
import ReactGA from "react-ga"

const Developer: React.FC = () => {
  const { username } = useParams()
  const [notFound, setNotFound] = useState<boolean>(false)

  const { profile, isLoading } = useSelector(
    ({ pwas: { devs, isDevPending } }: ReduxCombinedState) => ({
      profile: devs.find((x) => x.username === username),
      isLoading: isDevPending,
    }),
    shallowEqual
  )

  const dispatch = useDispatch()
  const addDev = useCallback(
    async (username: string) => dispatch(thunkGetDev(username)),
    [dispatch]
  )

  useEffect(() => {
    ;(async () => {
      if (!notFound) {
        if (!profile && username) {
          const fetchedDev = await addDev(username)
          if (!fetchedDev) {
            setNotFound(true)
          }
        }
      }
    })()
  }, [notFound, profile, username])

  const renderProfileSection = useMemo(
    () =>
      profile && (
        <ProfileCard
          gitHub={profile.github}
          linkedIn={profile.linkedIn}
          twitter={profile.twitter}
          avatar={profile.avatar}
          isLoading={isLoading}
          pwas={profile.apps}
          username={profile.username}
        />
      ),
    [profile, isLoading]
  )

  useIonViewDidEnter(() => {
    ReactGA.pageview(username!)
  })

  const renderAboutSection = useMemo(() => {
    return (
      <p
        style={{ margin: "0", padding: "16px" }}
        dangerouslySetInnerHTML={{
          __html: mdConverter.makeHtml(profile?.about!),
        }}
      />
    )
  }, [profile?.about])

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Developer</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="content">
        <IonRow>
          <IonCol size="12">{renderProfileSection}</IonCol>
          <IonCol size="12">{renderAboutSection}</IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  )
}

export default memo(Developer)
