import React, { useState, memo } from "react"
import { RouteComponentProps } from "react-router"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonGrid,
  IonRow,
  IonLabel,
  IonInput,
  IonCol,
  IonButton,
  IonText,
  IonToast,
  IonImg,
} from "@ionic/react"
import { setToken, setIsLoggedIn } from "../../data/user/user.actions"
import { postSignup } from "../../data/dataApi"
import { connect } from "../../data/connect"

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setToken: typeof setToken
  setIsLoggedIn: typeof setIsLoggedIn
}

interface StateProps {}

interface SignIn extends OwnProps, DispatchProps, StateProps {}

const SignUp: React.FC<SignIn> = ({
  setToken: setTokenAction,
  history,
  setIsLoggedIn: setIsLoggedInAction,
}) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [usernameError, setUsernameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [toastMessage, setToastMessage] = useState<string>()
  const [showToast, setShowToast] = useState<boolean>(false)

  const signup = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    if (!username) {
      setUsernameError(true)
    }
    if (!password) {
      setPasswordError(true)
    }
    if (!email) {
      setEmailError(true)
    }

    if (username && password && email) {
      try {
        const data = await postSignup(username, password, email)
        if (!data.token) {
          if (data.data && data.data.message) {
            setToastMessage(data.data.message)
            setShowToast(true)
          }
          return
        }
        setTokenAction(data.token)
        setIsLoggedInAction(true)
        setToastMessage("Success")
        setShowToast(true)
        history.push("/profile")
      } catch (e) {
        console.log(`Error signing up: ${e}`)
      }
    }
  }

  return (
    <IonPage>
      <IonContent style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <IonImg
            alt="logo"
            style={{ height: "100px", width: "100px" }}
            src="/assets/icon/logo.png"
          />
        </div>
        <form noValidate onSubmit={signup}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Username</IonLabel>
              <IonInput
                name="username"
                type="text"
                spellCheck={false}
                maxlength={30}
                value={username}
                onIonChange={(e) => {
                  setUsername(e.detail.value!)
                  setUsernameError(false)
                }}
                required
              />
            </IonItem>
            {formSubmitted && usernameError && (
              <IonText color="danger">
                <p className="ion-padding-start">Username is required</p>
              </IonText>
            )}
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                name="email"
                type="text"
                spellCheck={false}
                maxlength={50}
                value={email}
                onIonChange={(e) => {
                  setEmail(e.detail.value!)
                  setEmailError(false)
                }}
                required
              />
            </IonItem>
            {formSubmitted && emailError && (
              <IonText color="danger">
                <p className="ion-padding-start">Email is required</p>
              </IonText>
            )}
            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput
                name="password"
                type="password"
                spellCheck={false}
                value={password}
                maxlength={80}
                onIonChange={(e) => {
                  setPassword(e.detail.value!)
                  setPasswordError(false)
                }}
                required
              />
            </IonItem>
            {formSubmitted && passwordError && (
              <IonText color="danger">
                <p className="ion-padding-start">Password is required</p>
              </IonText>
            )}
          </IonList>
          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">
                Create
              </IonButton>
            </IonCol>
          </IonRow>
        </form>
      </IonContent>
      <IonToast
        isOpen={showToast}
        message={toastMessage}
        duration={3000}
        onDidDismiss={() => {
          setShowToast(false)
          setToastMessage("")
        }}
      />
    </IonPage>
  )
}

export default connect<OwnProps, StateProps, DispatchProps>({
  mapDispatchToProps: {
    setToken,
    setIsLoggedIn,
  },
  component: memo(SignUp),
})
