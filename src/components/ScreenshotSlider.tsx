import React from 'react';
import { IonSlides, IonSlide } from '@ionic/react';
import { Image } from '../util/types';

interface ContainerProps {
    screenshots: Image[]
}

const ScreenshotSlider: React.FC<ContainerProps> = ({ screenshots }) => {
  return (
    <IonSlides 
      style={{ marginBottom: '45px'}} 
      key={screenshots.map((shot) => shot.imageId).join('_')} 
      scrollbar={true}
      options={{ 
        initialSlide: 0, 
        speed: 400,
        slidesPerView: 3
      }}
    >
        {screenshots.map((shot, idx) => (
        <IonSlide key={idx}>
            <img style={{height: '400px', width: '200px'}} src={shot.url} /> 
        </IonSlide>
        ))}
    </IonSlides>  
  );
};

export default ScreenshotSlider;