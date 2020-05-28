import React, { useEffect, useState, useCallback } from "react"
import { Redirect, Route } from "react-router-dom"
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import {
  person,
  home,
  logIn,
  bandage,
  informationCircle,
  albumsOutline,
} from "ionicons/icons"
import {
  PWAs,
  SignUp,
  Support,
  Profile,
  Login,
  PWA,
  MyPWA,
  About,
  Admin,
  Categories,
} from "./pages"
import { loadUserData, loadProfile } from "./data/user/user.actions"
import { connect } from "./data/connect"
import { AppContextProvider } from "./data/AppContext"
import { RouteMap } from "./routes"
import ReactGA from "react-ga"
import { SideBar } from "./components"
import Home from "./pages/Home"
import { useDispatch, useSelector } from "react-redux"
import { thunkLoadUserData, thunkLoadProfile } from "./redux/User/actions"
import { ReduxCombinedState } from "./redux/RootReducer"

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <IonicApp />
    </AppContextProvider>
  )
}

const IonicApp: React.FC = () => {
  const dispatch = useDispatch()
  // TODO: Remove other load user and rename this.
  const loadUserData = useCallback(() => dispatch(thunkLoadUserData()), [
    dispatch,
  ])

  // TODO: Remove other load profile and rename this.
  const loadProfile = useCallback(
    (token: string) => dispatch(thunkLoadProfile(token)),
    [dispatch]
  )

  // TODO: Remove other state and rename vars
  const { isLoggedIn, token } = useSelector(
    ({ user: { isLoggedIn, token } }: ReduxCombinedState) => ({
      isLoggedIn: isLoggedIn,
      token: token,
    })
  )

  useEffect(() => {
    loadUserData()
  }, [])

  useEffect(() => {
    if (isLoggedIn && token) {
      loadProfile(token)
    }
  }, [isLoggedIn, token])

  useEffect(() => {
    ReactGA.initialize("UA-165324521-1")
  }, [])

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet animated={false}>
            <Route path={[RouteMap.PWA_DETAIL]} component={PWA} exact={false} />
            <Route path={[RouteMap.SUPPORT]} component={Support} exact={true} />
            <Route path={RouteMap.SIGNUP} component={SignUp} />
            <Route path={RouteMap.LOGIN} component={Login} />
            <Route path={RouteMap.PROFILE} component={Profile} />
            <Route path={RouteMap.MY_PWA_DETAIL} component={MyPWA} />
            <Route path={RouteMap.ABOUT} component={About} />
            <Route path={RouteMap.ADMIN} component={Admin} exact />
            <Route path={RouteMap.CATEGORIES} component={Categories} exact />
            <Route path={[RouteMap.PWAS]} component={PWAs} exact />
            <Route path="/home" component={Home} />
            <Route
              path={RouteMap.ROOT}
              render={() => <Redirect to={RouteMap.HOME} />}
              exact={true}
            />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton className="tab" tab="home" href={RouteMap.HOME}>
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton
              className="CatTabButton"
              tab="categories"
              href={RouteMap.CATEGORIES}
            >
              <IonIcon icon={albumsOutline} />
              <IonLabel>Categories</IonLabel>
            </IonTabButton>
            <IonTabButton className="tab" tab="about" href={RouteMap.ABOUT}>
              <IonIcon icon={informationCircle} />
              <IonLabel>About</IonLabel>
            </IonTabButton>
            <IonTabButton
              className="tab"
              tab="login"
              href={RouteMap.LOGIN}
              disabled={isLoggedIn}
              hidden={isLoggedIn}
            >
              <IonIcon icon={logIn} />
              <IonLabel>Log In</IonLabel>
            </IonTabButton>
            <IonTabButton
              className="tab"
              tab="profile"
              href={RouteMap.PROFILE}
              disabled={!isLoggedIn}
              hidden={!isLoggedIn}
            >
              <IonIcon icon={person} />
              <IonLabel>Profile</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
