import React, { memo, useState, useCallback, useEffect } from "react"
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonProgressBar,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react"
import { useDispatch, shallowEqual, useSelector } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"
import {
  thunkCreateProfile,
  thunkAddJob,
  thunkAddEducation,
} from "../../redux/User/actions"
import "react-mde/lib/styles/css/react-mde-all.css"
import "./styles.css"
import ReactGA from "react-ga"
import JobForm from "../../components/JobForm"
import ProfileForm from "../../components/ProfileForm"
import { Degree } from "../../util/types"
import EducationForm from "../../components/EducationForm"

type SettingSection = "profile" | "education" | "jobs"

const Settings: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<SettingSection>(
    "profile"
  )

  const { email, profile, isLoading, status } = useSelector(
    ({
      user: { email, profile, loading },
      alerts: { status },
    }: ReduxCombinedState) => ({
      email: email,
      profile: profile,
      status: status,
      isLoading: loading,
    }),
    shallowEqual
  )

  const dispatch = useDispatch()
  const createProfile = useCallback(
    async (
      updateGitHub: string,
      updateLinkedIn: string,
      updateTwitter: string,
      updateShowEmail: boolean,
      updateEmail: string,
      updateAbout: string,
      updateHeader: string | undefined,
      updateLocation: string | undefined,
      updateFullName: string | undefined,
      updateAvatar: File | undefined
    ) => {
      dispatch(
        thunkCreateProfile(
          updateGitHub,
          updateLinkedIn,
          updateTwitter,
          updateShowEmail,
          updateEmail,
          updateAbout,
          updateHeader,
          updateLocation,
          updateFullName,
          updateAvatar
        )
      )
    },
    [dispatch]
  )
  const createJob = useCallback(
    async (company: string, title: string, start: string, end?: string) => {
      dispatch(thunkAddJob(company, title, start, end))
    },
    [dispatch]
  )
  const createEducation = useCallback(
    async (
      school: string,
      major: string,
      degree: Degree,
      gradDate: string,
      minor?: string
    ) => {
      dispatch(thunkAddEducation(school, major, gradDate, degree, minor))
    },
    [dispatch]
  )

  useEffect(() => {
    ReactGA.pageview(`settings`)
  }, [])

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/profile" />
          </IonButtons>
          <IonTitle>Edit Profile</IonTitle>
        </IonToolbar>
        {isLoading && <IonProgressBar type="indeterminate" color="primary" />}
      </IonHeader>
      <IonContent className="content">
        <IonSegment
          value={selectedSection}
          onIonChange={(e) =>
            setSelectedSection(e.detail.value as SettingSection)
          }
        >
          <IonSegmentButton value="profile">Profile</IonSegmentButton>
          <IonSegmentButton value="education">Education</IonSegmentButton>
          <IonSegmentButton value="jobs">Jobs</IonSegmentButton>
        </IonSegment>
        <div className="SettingsAvatarContainer">
          <img
            className="SettingsAvatar icon line-around"
            src={
              profile && profile.avatar
                ? profile.avatar
                : "assets/icon/apple-touch-icon.png"
            }
          />
        </div>
        {selectedSection === "profile" && (
          <ProfileForm
            profile={profile}
            email={email}
            status={status}
            onSubmit={createProfile}
          />
        )}
        {selectedSection === "education"}
        {selectedSection === "jobs" && <JobForm onSubmit={createJob} />}
        {selectedSection === "education" && (
          <EducationForm onSubmit={createEducation} />
        )}
      </IonContent>
    </IonPage>
  )
}

export default memo(Settings)
