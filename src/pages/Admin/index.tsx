import React, { useState, memo, useEffect, useMemo, Fragment } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonItem,
  IonLabel,
  IonTextarea,
  IonImg,
  IonRow,
  IonCol,
} from "@ionic/react"
import { withRouter, useHistory } from "react-router"
import { getAllPending, postStatus } from "../../data/dataApi"
import { PWA } from "../../util/types"
import { useSelector } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { UserRole } from "../../redux/User/types"

const Admin: React.FC = () => {
  const [pwas, setPwas] = useState<PWA[]>([])
  const [status, setStatus] = useState<string | undefined>()
  const [reason, setReason] = useState<string | undefined>()

  const { role } = useSelector(({ user: { role } }: ReduxCombinedState) => ({
    role: role,
  }))

  useEffect(() => {
    if (role === UserRole.Admin) {
      ;(async () => {
        const resp = await getAllPending()
        if (resp.data) {
          setPwas(resp.data)
        }
      })()
    }
  }, [role])

  const renderAdmin = useMemo(
    () => (
      <Fragment>
        {role === UserRole.Admin ? (
          pwas &&
          pwas.map((pwa, idx) => {
            return (
              <div key={idx} style={{ padding: "30px" }}>
                <div>
                  <IonLabel>Name</IonLabel>
                  <IonItem>
                    <span>{pwa.name}</span>
                  </IonItem>
                  <IonLabel>Link</IonLabel>
                  <IonItem>
                    <IonButton
                      onClick={() => {
                        window.open(pwa.link)
                      }}
                    >
                      Link
                    </IonButton>
                  </IonItem>
                  <IonLabel>Desc</IonLabel>
                  <IonItem>
                    <p>{pwa.description}</p>
                  </IonItem>
                  <IonLabel>Category</IonLabel>
                  <IonItem>
                    <span>{pwa.category}</span>
                  </IonItem>
                  <IonLabel>Icon</IonLabel>
                  <IonItem>
                    <IonImg alt="icon" src={pwa.icon} />
                  </IonItem>
                  <IonLabel>Screenshots</IonLabel>
                  <IonItem>
                    {pwa.screenshots.map((shot, idx) => (
                      <div key={idx}>
                        <IonImg alt="screenshot" src={shot.url} />
                      </div>
                    ))}
                  </IonItem>
                </div>
                <div>
                  <IonSelect
                    onIonChange={(e) => {
                      if (e.detail.value === "APPROVED") {
                        setReason(undefined)
                      }
                      setStatus(e.detail.value!)
                    }}
                    placeholder="Status"
                  >
                    <IonSelectOption value="APPROVED">APPROVED</IonSelectOption>
                    <IonSelectOption value="DENIED">DENIED</IonSelectOption>
                  </IonSelect>
                  {status && status === "DENIED" && (
                    <IonTextarea
                      value={reason}
                      placeholder="Please give a reason"
                      onIonChange={(e) => setReason(e.detail.value!)}
                      rows={4}
                    />
                  )}
                  <IonButton
                    onClick={async () => {
                      const resp = await postStatus(status!, pwa.appId, reason)
                      if (resp.status === 200) {
                        setStatus(undefined)
                        setReason(undefined)
                        setPwas(pwas.filter((app) => app.appId !== pwa.appId))
                      }
                    }}
                  >
                    Submit
                  </IonButton>
                </div>
              </div>
            )
          })
        ) : (
          <IonRow>
            <IonCol sizeMd="8" className="HomeCardListCol">
              <h1 className="HomeCardsHeader">Page Not Found</h1>
            </IonCol>
          </IonRow>
        )}
      </Fragment>
    ),
    [role, pwas]
  )

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>{renderAdmin}</IonContent>
    </IonPage>
  )
}

export default withRouter(memo(Admin))
