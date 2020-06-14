import React, {
  useEffect,
  useState,
  memo,
  useCallback,
  useMemo,
  Fragment,
} from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonButtons,
  IonAlert,
  IonCol,
  IonProgressBar,
} from "@ionic/react"
import { useHistory } from "react-router"
import { PWACard } from "../../components"
import { RouteMap } from "../../routes"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import { thunkLogout, thunkAddPWA } from "../../redux/User/actions"
import SumbitAppModal from "../../components/SumbitAppModal"
import "./styles.css"
import Popover from "../../components/Popover"
import { add, logOut, menu, peopleOutline } from "ionicons/icons"

const Profile: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [showPopover, setShowPopover] = useState<boolean>(false)
  const history = useHistory()

  const { pwas, username, isLoading, isLoggedIn, status } = useSelector(
    ({
      user: { pwas, username, loading, isLoggedIn },
      alerts: { status },
    }: ReduxCombinedState) => ({
      pwas: pwas,
      username: username,
      isLoading: loading,
      isLoggedIn: isLoggedIn,
      status: status,
    }),
    shallowEqual
  )

  const dispatch = useDispatch()
  const logout = useCallback(() => dispatch(thunkLogout()), [dispatch])
  const addApp = useCallback(
    async (
      name: string,
      description: string,
      url: string,
      category: string,
      icon: File,
      screenshots: File[],
      tags: string[]
    ) => {
      dispatch(
        thunkAddPWA(name, description, url, category, icon, screenshots, tags)
      )
    },
    [dispatch]
  )

  useEffect(() => {
    if (!isLoggedIn) {
      history.push(RouteMap.LOGIN)
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (status === "success" && showModal) {
      setShowModal(false)
    }
  }, [status])

  const loadPwas = (filter: string) => {
    if (pwas) {
      const filteredPwas = pwas.filter((pwa) => pwa.status === filter)
      if (filteredPwas.length > 0) {
        return filteredPwas.map((pwa, idx) => (
          <IonCol key={idx} sizeXs="6" sizeSm="4" sizeMd="3">
            <PWACard url="/mypwa" pwa={pwa} />
            {filter === "DENIED" && (
              <>
                <span style={{ paddingLeft: "15px" }}>
                  <strong>Reason</strong>
                </span>
                <p style={{ padding: "15px" }}>{pwa.reason}</p>
              </>
            )}
          </IonCol>
        ))
      } else {
        return (
          <IonCol>
            <small className="NoAppsNote">{`No ${filter.toLowerCase()} apps yet`}</small>
          </IonCol>
        )
      }
    }
  }

  const renderAppsSections: JSX.Element = useMemo(
    () =>
      !isLoading && pwas ? (
        <Fragment>
          <h2 style={{ marginLeft: "20px" }}>Approved</h2>
          <IonRow>{loadPwas("APPROVED")}</IonRow>
          <h2 style={{ marginLeft: "20px" }}>Pending</h2>
          <IonRow>{loadPwas("PENDING")}</IonRow>
          <h2 style={{ marginLeft: "20px" }}>Denied</h2>
          <IonRow>{loadPwas("DENIED")}</IonRow>
        </Fragment>
      ) : (
        <IonProgressBar type="indeterminate" />
      ),
    [pwas, isLoading]
  )

  return (
    <IonPage>
      <SumbitAppModal
        isOpen={showModal}
        closeModal={() => setShowModal(false)}
        onSubmit={addApp}
      />
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="end">
            <Popover
              showPopover={showPopover}
              setShowPopover={setShowPopover}
              icon={menu}
              items={[
                {
                  name: "Add PWA",
                  action: () => setShowModal(true),
                  icon: add,
                },
                {
                  name: "Support",
                  action: () => history.push(RouteMap.SUPPORT),
                  icon: peopleOutline,
                },
                {
                  name: "Log out",
                  action: () => setShowAlert(true),
                  icon: logOut,
                },
              ]}
            />
          </IonButtons>
          <IonTitle>{username}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="content">
        <IonGrid fixed>{renderAppsSections}</IonGrid>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Logout"
          message="Are you sure you want to log out?"
          buttons={[
            {
              text: "Cancel",
              handler: () => setShowAlert(false),
            },
            {
              text: "Logout",
              handler: () => {
                logout()
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  )
}

export default memo(Profile)
