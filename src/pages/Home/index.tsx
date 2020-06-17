import { IonContent, IonNote, IonPage, useIonViewDidEnter } from "@ionic/react"
import React, { useCallback, useEffect, useMemo, useRef, memo } from "react"
import ReactGA from "react-ga"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { AddToHomeScreen } from "../../components"
import Footer from "../../components/Footer"
import HidingHeader from "../../components/HidingHeader"
import HomeRow from "../../components/HomeRow"
import { useAddToHomescreenPrompt } from "../../hooks/useAddToHomescreenPrompt"
import { thunkGetHomeData } from "../../redux/PWAs/actions"
import { ReduxCombinedState } from "../../redux/RootReducer"
import "./styles.css"
import { useHidingHeader } from "../../hooks/useHidingHeader"

const Home: React.FC = () => {
  const content = useRef<any>()
  const [prompt, promptToInstall] = useAddToHomescreenPrompt()
  const [hideDecimal, setScrollYCurrent] = useHidingHeader(50)

  const { homeData, isLoading } = useSelector(
    ({ pwas }: ReduxCombinedState) => ({
      homeData: pwas.home,
      isLoading: pwas.isPending,
    }),
    shallowEqual
  )
  const dispatch = useDispatch()
  const getHomeData = useCallback(() => dispatch(thunkGetHomeData()), [
    dispatch,
  ])

  useIonViewDidEnter(() => {
    getHomeData()
  })

  useEffect(() => {
    ReactGA.pageview(`Home`)
  }, [])

  const renderHomeList = useMemo(() => {
    return (
      <>
        <HomeRow
          pwas={homeData.topApps}
          title="Top"
          subtitle="Most popular"
          linkTo=""
          isLoading={isLoading}
        />
        <HomeRow
          pwas={homeData.discoverApps}
          title="Discover"
          subtitle="Currently trending"
          linkTo="trending"
          isLoading={isLoading}
        />
        <HomeRow
          pwas={homeData.newApps}
          title="New"
          subtitle="Fresh new uploads"
          linkTo="new"
          isLoading={isLoading}
        />
      </>
    )
  }, [homeData, isLoading])

  const renderHeader = useMemo(() => {
    return (
      <HidingHeader hideDecimal={hideDecimal}>
        <div className="HomeHeader">
          <div>
            <h1>PWA Store</h1>
            <IonNote>Progressive Web App Discovery</IonNote>
          </div>
          <div>
            <AddToHomeScreen
              prompt={prompt}
              promptToInstall={promptToInstall}
            />
          </div>
        </div>
      </HidingHeader>
    )
  }, [hideDecimal, promptToInstall, prompt])

  return (
    <IonPage>
      {renderHeader}
      <IonContent
        fullscreen={true}
        scrollEvents={true}
        onIonScroll={(e) => setScrollYCurrent(e.detail.scrollTop)}
        className="content"
        ref={content}
      >
        {renderHomeList}
        <Footer />
      </IonContent>
    </IonPage>
  )
}

export default memo(Home)
