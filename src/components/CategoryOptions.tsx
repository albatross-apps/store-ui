import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonGrid, IonRow, IonImg, IonSelect, IonSelectOption } from '@ionic/react';
import './PWACard.css';

const categories = [
    'GAME',
    'EDUCATION',
    'FITNESS',
    'DATING',
    'SOCIAL'
]
interface ContainerProps {
    onPress: (option: string) => void
}

const CategoryOptions: React.FC<ContainerProps> = ({
    onPress
}) => {

    const getOptions = () => {
        return (
        categories.map((cat, idx) => <IonSelectOption key={idx} value={cat}>{cat}</IonSelectOption>)
        )
    }

  return (
      <IonSelect placeholder='Category' onIonChange={e => onPress(e.detail.value!)} >
          {getOptions()}
      </IonSelect>
  );
};

export default CategoryOptions;