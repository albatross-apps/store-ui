import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonSearchbar, IonPopover, IonButton, IonList, IonItem, useIonViewDidEnter, IonInfiniteScroll, IonInfiniteScrollContent, useIonViewDidLeave } from '@ionic/react';
import PWACard from '../components/PWACard';
import CategoryOptions from '../components/CategoryOptions';
import { getPWAs, getSearchApp } from '../data/dataApi';
import { PWA, Search } from '../util/types';
import { resolveAny } from 'dns';

const PWAs: React.FC = () => {

  const [page, setPage] = useState<number>(0);
  const [cat, setCat] = useState<string>('');
  const [pwas, setPwas] = useState<PWA[]>([]);
  const [searchResults, setSearchResults] = useState<Search[]>([]);
  const scrollEl = useRef<any>(undefined);

  useIonViewDidEnter(() => {
    loadPWAs();
  }, [])

  useIonViewDidLeave(() => {
    setPwas([]);
    setPage(0);
  })

  const loadPWAs = async () => {
    const resp = await getPWAs(page);
    if (resp.length > 0) {
      setPwas(prev => prev.concat(resp));
    }
  }

  const pwaList = () => {
    let resultPwas = pwas;
    if (resultPwas && resultPwas.length > 0) {
      if (cat !== '' && cat !== 'ALL') {
        resultPwas = pwas.filter(pwa => pwa.category === cat);
      }
      if (resultPwas.length > 0) {
        return resultPwas.map((pwa, idx) => <PWACard key={idx} category={pwa.category} name={pwa.name} icon={pwa.icon} appId={pwa.appId} />)
      } else {
        return <div></div>
      }
    } else {
      return <div></div>
    }
  }

  const loadMorePwas = async () => {
    const nextPage = page + 1;
    console.log(nextPage);
    const nextPwas = await getPWAs(nextPage);
    setPwas(prev => prev.concat(nextPwas));
    setPage(nextPage);
    scrollEl.current.complete();
  }

  const onPress = (option: string) => {
    if (option === 'ALL') {
      setCat('');
    } else {
      setCat(option);
    }
  }

  const onSearchChange = async (e: CustomEvent) => {
    const appName = e.detail.value.replace(/\s/g, '');
    if (appName) {
      const results = await getSearchApp(appName);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
            <IonTitle>PWA's</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonSearchbar onIonChange={onSearchChange} />
          <IonList>
              { searchResults && searchResults.map((result, idx) => 
                <IonItem button href={`/pwa/${result.appId}`} key={idx}>
                  {result.name}
                </IonItem>
              ) }
            </IonList>
        <CategoryOptions onPress={onPress} />
        <IonInfiniteScroll ref={scrollEl} onIonInfinite={loadMorePwas}>
          <IonInfiniteScrollContent>
              <IonGrid >
                <IonRow>
                  {pwaList()}
                </IonRow>
              </IonGrid>
          </IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default PWAs;
