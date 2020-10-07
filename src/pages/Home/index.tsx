import {
  IonContent,
  IonNote,
  IonPage,
  useIonViewDidEnter,
  IonButtons,
  IonButton,
  IonIcon,
  IonRow,
  IonCol,
  useIonViewDidLeave,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonTitle,
} from "@ionic/react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  memo,
  useState,
} from "react";
import ReactGA from "react-ga";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AddToHomeScreen } from "../../components";
import HidingHeader from "../../components/HidingHeader";
import HomeRow from "../../components/HomeRow";
import { useAddToHomescreenPrompt } from "../../hooks/useAddToHomescreenPrompt";
import { thunkGetHomeData } from "../../redux/PWAs/actions";
import { ReduxCombinedState } from "../../redux/RootReducer";
import "./styles.css";
import { useHidingHeader } from "../../hooks/useHidingHeader";
import {
  thunkSetDarkMode,
  thunkLoadFollowedDevLogs,
  thunkAddDevLog,
  thunkRemoveDevLog,
  thunkAddLogLike,
} from "../../redux/User/actions";
import { sunny, moon } from "ionicons/icons";
import DevLogCard from "../../components/DevLogCard";
import DevLogForm from "../../components/DevLogForm";
import { DevLog } from "../../util/types";
import { Axios } from "../../redux/Actions";

const Home: React.FC = () => {
  const content = useRef<any>();
  const [prompt, promptToInstall] = useAddToHomescreenPrompt();
  const [hideDecimal, setScrollYCurrent] = useHidingHeader(50);
  const [logs, setLogs] = useState<DevLog[]>([]);
  const [page, setPage] = useState<number>(0);
  const scrollEl = useRef<HTMLIonInfiniteScrollElement>(null);

  const {
    homeData,
    isLoading,
    darkMode,
    isLoggedIn,
    devLogs,
    pwas,
    status,
  } = useSelector(
    ({
      pwas: { home, isPending },
      user: { darkMode, isLoggedIn, devLogs, pwas },
      alerts: { status },
    }: ReduxCombinedState) => ({
      homeData: home,
      isLoading: isPending,
      darkMode,
      isLoggedIn,
      devLogs,
      pwas,
      status,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();
  const getHomeData = useCallback(() => dispatch(thunkGetHomeData()), [
    dispatch,
  ]);
  const getFollowedDevLogs = useCallback(
    (page: number) => dispatch(thunkLoadFollowedDevLogs(page)),
    [dispatch]
  );
  const setDarkMode = useCallback(
    (active: boolean) => dispatch(thunkSetDarkMode(active)),
    [dispatch]
  );

  useIonViewDidEnter(() => {
    getHomeData();
    if (isLoggedIn) {
      getFollowedDevLogs(page);
    } else {
      (async () => {
        const resp = await (await Axios()).get(`public/log/feed/${page}`);
        setLogs(resp.data as DevLog[]);
      })();
    }
  }, [isLoggedIn]);

  useIonViewDidLeave(() => {
    setLogs([]);
    setPage(0);
  });

  useEffect(() => {
    ReactGA.pageview(`Home`);
  }, []);

  const renderHomeList = useMemo(() => {
    return (
      <div className="AppsColContainer">
        <HomeRow
          pwas={homeData.featuredApps}
          title="Featured"
          subtitle="Editors Choice"
          linkTo="featured"
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
          pwas={homeData.topApps}
          title="Top"
          subtitle="Most popular"
          linkTo=""
          isLoading={isLoading}
        />
      </div>
    );
  }, [homeData, isLoading]);

  const renderHeader = useMemo(() => {
    return (
      <HidingHeader hideDecimal={hideDecimal}>
        <div className="HomeHeader">
          <div>
            <h1>ProgressiveApp.Store</h1>
            <IonNote>Build, Discover and Share Applications</IonNote>
          </div>
          <div>
            <IonButtons>
              <IonButton onClick={(e) => setDarkMode(!darkMode)}>
                <IonIcon icon={darkMode ? moon : sunny} />
              </IonButton>
              <AddToHomeScreen
                prompt={prompt}
                promptToInstall={promptToInstall}
              />
            </IonButtons>
          </div>
        </div>
      </HidingHeader>
    );
  }, [hideDecimal, promptToInstall, prompt, darkMode]);

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
        <IonRow>
          <IonCol className="AppsCol" size="12">
            {renderHomeList}
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default memo(Home);
