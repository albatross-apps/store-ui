import { StoreNotification } from "../../util/types"
import React, { useState, memo, useEffect } from "react"
import {
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
  IonTitle,
  IonProgressBar,
} from "@ionic/react"
import { mdConverter, removeMarkdown, dateNoTimeFormatter } from "../../util"
import { trash } from "ionicons/icons"
import ReactGA from "react-ga"

interface BodyProps {
  subject: string
  body: string
  showMore: boolean
  onDidDismiss: () => void
}

const More: React.FC<BodyProps> = ({
  subject,
  body,
  showMore,
  onDidDismiss,
}) => {
  useEffect(() => {
    if (showMore) {
      ReactGA.modalview(`notifications/${subject}`)
    }
  }, [showMore])

  return (
    <IonModal isOpen={showMore} onDidDismiss={onDidDismiss}>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonTitle>{subject}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDidDismiss}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div
          style={{
            padding: "16px",
            minHeight: "200px",
            color: "var(--text-color)",
          }}
          dangerouslySetInnerHTML={{
            __html: mdConverter.makeHtml(body),
          }}
        />
      </IonContent>
    </IonModal>
  )
}

interface ContainerProps {
  notifications: StoreNotification[]
  deleteCallback?: (id: number) => void
  loading?: boolean
}

const NotifyList: React.FC<ContainerProps> = ({
  notifications,
  deleteCallback,
  loading = false,
}) => {
  const [body, setBody] = useState("")
  const [subject, setSubject] = useState("")
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      <IonRow>
        <IonCol>
          {loading === true ? (
            <IonProgressBar type="indeterminate" />
          ) : (
            <IonList lines="inset">
              {notifications.map((n, i) => (
                <IonItem
                  button
                  onClick={() => {
                    setBody(n.body)
                    setSubject(n.subject)
                    setShowMore(true)
                  }}
                  key={i}
                >
                  <IonLabel>
                    <h2>{n.subject}</h2>
                    <p>{dateNoTimeFormatter(n.createdAt)}</p>
                    <p>{removeMarkdown(n.body)}</p>
                  </IonLabel>
                  {deleteCallback && (
                    <IonButton
                      item-right
                      style={{ zIdex: "100" }}
                      slot="end"
                      fill="clear"
                      onClick={(e) => {
                        deleteCallback(n.id)
                        e.stopPropagation()
                      }}
                    >
                      <IonIcon icon={trash} />
                    </IonButton>
                  )}
                </IonItem>
              ))}
            </IonList>
          )}
        </IonCol>
      </IonRow>
      <More
        body={body}
        subject={subject}
        showMore={showMore}
        onDidDismiss={() => setShowMore(false)}
      />
    </>
  )
}

export default memo(NotifyList)
