import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonModal, IonList, IonInput, IonTextarea, IonText, IonImg } from '@ionic/react';
import { getProfile, postApp } from '../data/dataApi';
import { RouteComponentProps, withRouter } from 'react-router';
import ImageUploader from 'react-images-upload';
import { connect } from '../data/connect';
import CategoryOptions from '../components/CategoryOptions';

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {}

interface StateProps {}

interface ProfileProps extends OwnProps,  DispatchProps, StateProps {}

const Profile: React.FC<ProfileProps> = ({
}) => {

  const [url, setUrl] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [cat, setCat] = useState<string>('');
  const [icon, setIcon] = useState<File | undefined>(undefined);
  const [screenshots, setScreenshots] = useState<File[] | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [nameTakenError, setNameTakenError] = useState<boolean>(false);

  useEffect(() => {
    getProfile();
  }, [])

  const onPress = (option: string) => {
    setCat(option);
  }

  const onIconChange = (files: File[]) => {
    setIcon(files[0]);
  }

  const onScreenshotsChange = (files: File[]) => {
    setScreenshots(files);
  }

  const onAddPWA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && url && desc && cat && icon && screenshots) {
        const resp = await postApp(name, desc, url, cat, icon, screenshots);
        if (resp && resp.data && resp.data.message === 'Name is taken') {
          setNameTakenError(true);
        } else if (resp && resp.appId) {
          setName('');
          setDesc('');
          setCat('');
          setUrl('');
          setIcon(undefined);
          setScreenshots(undefined);
          setShowModal(false);
        }
    }
  }

  return (
    <IonPage>
        <IonModal 
          isOpen={showModal} 
          swipeToClose={true}
          onDidDismiss={() => setShowModal(false)}
        >
        <IonContent scrollEvents={true}>
        <form>
          <IonList>
            <IonItem>
            <IonLabel position="stacked">Name</IonLabel>
                    <IonInput
                        name="name"
                        type="text"
                        spellCheck={false}
                        value={name}
                        onIonChange={e => {
                            setName(e.detail.value!)
                            setNameTakenError(false)
                        }}
                        required
                    />
                    {nameTakenError &&
                    <IonText color="danger">
                      <p>Name is taken</p>
                    </IonText>}
            </IonItem>
            <IonItem>
              <ImageUploader 
                fileContainerStyle={{
                  boxShadow: 'none'
                }}
                withPreview={true}
                withLabel={false}
                singleImage={true}
                withIcon={false}
                buttonText='Choose icon'
                onChange={onIconChange}
                imgExtension={['.jpg', '.png']}
                maxFileSize={5242880}
              />
            </IonItem>
            <IonItem>
            <IonLabel position="stacked">Link</IonLabel>
                    <IonInput
                        name="link"
                        type="text"
                        spellCheck={false}
                        value={url}
                        onIonChange={e => {
                            setUrl(e.detail.value!)
                        }}
                        required
                    />
            </IonItem>
            <IonItem>
            <IonLabel position="stacked">Description</IonLabel>
                    <IonTextarea
                        name="desc"
                        placeholder="Please describe your PWA"
                        rows={6}
                        spellCheck={true}
                        value={desc}
                        maxlength={1500}
                        onIonChange={e => {
                            setDesc(e.detail.value!)
                        }}
                        required
                    />
            </IonItem>
            <IonItem>
              <CategoryOptions onPress={onPress}/>
            </IonItem>
            <IonItem>
              <ImageUploader 
                fileContainerStyle={{
                  boxShadow: 'none'
                }}
                withPreview={true}
                withLabel={false}
                singleImage={false}
                withIcon={false}
                onChange={onScreenshotsChange}
                buttonText='Choose screenshots'
                imgExtension={['.jpg', '.png']}
                maxFileSize={5242880}
              />
            </IonItem>
          </IonList>
        </form>
        </IonContent>
        <IonButton expand='block' onClick={onAddPWA}>Add</IonButton>
        <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
      </IonModal>
      <IonItem button routerLink="/logout" routerDirection="none">
        <IonLabel>Logout</IonLabel>
      </IonItem>
      <IonItem>
        {}
      </IonItem>
      <IonButton onClick={() => setShowModal(true)}>Add PWA</IonButton>
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  component: withRouter(Profile)
})