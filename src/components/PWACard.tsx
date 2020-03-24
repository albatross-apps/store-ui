import React from 'react';
import { IonCard, IonCardContent } from '@ionic/react';

interface ContainerProps {
    name?: string,
    category?: string
    icon?: string
    appId?: number,
    url: string,
    history: any,
}

const PWACard: React.FC<ContainerProps> = ({ name, icon, category, appId, url, history }) => {
  return (
    <IonCard button style={{ height: '330px', width: '330px'}} onClick={() => history.push(`${url}/${appId}`)}>
        <IonCardContent>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <img style={{ height: '200px', width: '200px', borderRadius: '5px'}} src={icon} />
            </div>
        </IonCardContent>
        <div style={{paddingLeft: '10px'}}>
            <p style={{margin: '0', fontSize: '20px'}}>{name}</p>
            <small>{category}</small>
        </div>
    </IonCard>
  );
};

export default PWACard;