import React, { memo, useState, Fragment } from "react"
import {
  IonButton,
  IonIcon,
  IonChip,
  IonLabel,
  IonRouterLink,
  IonFabButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonRow,
} from "@ionic/react"
import { ShareUrl, FormItem } from "../"
import { PWA } from "../../util/types"
import ReactGA from "react-ga"

import { openOutline, starOutline, starSharp } from "ionicons/icons"
import { Axios } from "../../redux/Actions"
import CategoryOptions from "../CategoryOptions"
import ReactTagInput from "@pathofdev/react-tag-input"
import "./styles.css"
import { noSpecialChars, mdConverter } from "../../util"
import ReactMde from "react-mde"
import { useHistory } from "react-router"
import { RouteMap, GetPWADetailUrl } from "../../routes"
import BadgeShare from "../BadgeShare"

interface ContainerProps {
  pwa: PWA
  isMyPwa: boolean
  openModal?: () => void
  isLoggedIn?: boolean | undefined
  onStar?: (appId: number) => void
  isEdit?: boolean
  name?: string
  cat?: string
  desc?: string
  tags?: string[]
  setName?: (name: string) => void
  setCat?: (option: string) => void
  setDesc?: (description: string) => void
  setTags?: (tasg: string[]) => void
}

const PWAInfo: React.FC<ContainerProps> = ({
  pwa,
  isMyPwa,
  openModal,
  isLoggedIn,
  onStar,
  isEdit = false,
  name,
  cat,
  desc,
  tags,
  setName,
  setCat,
  setDesc,
  setTags,
}) => {
  const history = useHistory()
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write")

  const onInstall = () => {
    if (!isMyPwa) {
      ;(async () => await (await Axios()).post(`public/pwa/${pwa.appId}`))()
      ReactGA.event({
        category: "installed",
        action: pwa.name,
      })
    }
  }

  const onClickStar = () => {
    if (isLoggedIn) {
      onStar && onStar(pwa.appId)
    } else {
      history.push(RouteMap.LOGIN)
    }
  }

  return (
    <>
      <IonCard className="line-around">
        <IonCardContent>
          <IonRow>
            <IonCol size="12" sizeSm="10">
              <div className="PWAInfoHeader">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img alt="icon" className="PWAInfoIcon" src={pwa.icon} />
                  <div className="PWAInfoToolbar">
                    {isEdit ? (
                      <FormItem
                        name="Name"
                        value={name!}
                        onChange={(e) => setName!(e.detail!.value)}
                        maxLength={25}
                        showError={!noSpecialChars(name!)}
                        errorMessage="No special chars allowed"
                      />
                    ) : (
                      <span
                        className="text-color"
                        style={{ padding: "8px", fontSize: "20px" }}
                      >
                        {pwa.name}
                      </span>
                    )}
                    {isEdit ? (
                      <FormItem
                        name="Category"
                        showError={false}
                        errorMessage=""
                      >
                        <CategoryOptions initValue={cat} onPress={setCat!} />
                      </FormItem>
                    ) : (
                      <small style={{ padding: "8px" }}>{pwa.category}</small>
                    )}
                  </div>
                </div>
              </div>
              {pwa.username && (
                <IonRouterLink
                  style={{ marginLeft: "8px" }}
                  routerLink={`/dev/${pwa.username}`}
                >
                  {`${pwa.fullName ? pwa.fullName : pwa.username}`}
                </IonRouterLink>
              )}
              <div className="InfoStarBlock">
                <IonButton fill="outline" onClick={onClickStar} color="dark">
                  {pwa.appRatings.hasRated ? "Unfollow" : "Follow"}
                </IonButton>
                <IonFabButton
                  className="InfoStarIcon primary-color"
                  onClick={openModal}
                >
                  {pwa.ratingsCount}
                </IonFabButton>
              </div>
              {isEdit ? (
                <FormItem name="Tags" showError={false} errorMessage="">
                  <div style={{ padding: "10px", width: "100%" }}>
                    <ReactTagInput
                      tags={tags!}
                      onChange={(newTags) => {
                        setTags!(newTags)
                      }}
                      validator={(tag) => {
                        return tag.length <= 30
                      }}
                      removeOnBackspace={true}
                      maxTags={5}
                      placeholder="Enter to add"
                    />
                  </div>
                </FormItem>
              ) : (
                pwa.tags.length > 0 && (
                  <Fragment>
                    {pwa.tags.map((x, i) => (
                      <IonChip key={i}>
                        <IonLabel>{x}</IonLabel>
                      </IonChip>
                    ))}
                  </Fragment>
                )
              )}
              <div className="PWAShareContainer">
                <ShareUrl
                  title={pwa.name}
                  url={`https://info.progressiveapp.store${GetPWADetailUrl(
                    pwa.name
                  )}`}
                />
              </div>
            </IonCol>
            <IonCol size="12" sizeSm="2">
              <IonButton
                color="dark"
                fill="outline"
                href={pwa.link}
                target="_blank"
                onClick={onInstall}
              >
                VIEW{" "}
                <IonIcon style={{ marginLeft: "10px" }} icon={openOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonCardContent>
      </IonCard>
      {isMyPwa && (
        <IonCard className="line-around">
          <IonCardContent>
            <BadgeShare name={pwa.name} />
          </IonCardContent>
        </IonCard>
      )}
      <IonCard className="line-around">
        <IonCardContent>
          {isEdit ? (
            <FormItem
              name="Description"
              showError={!desc || desc.length > 1500}
              errorMessage="Description is required and max length is 1500 characters"
            >
              <div
                style={{ width: "100%", height: "100%", paddingTop: "16px" }}
              >
                <ReactMde
                  classes={{ grip: "hide", toolbar: "mde-toolbar" }}
                  value={desc}
                  onChange={setDesc}
                  selectedTab={selectedTab}
                  onTabChange={setSelectedTab}
                  generateMarkdownPreview={(md) =>
                    Promise.resolve(mdConverter.makeHtml(desc!))
                  }
                />
              </div>
            </FormItem>
          ) : (
            <div
              style={{ minHeight: "200px" }}
              dangerouslySetInnerHTML={{
                __html: mdConverter.makeHtml(pwa.description),
              }}
            />
          )}
        </IonCardContent>
      </IonCard>
    </>
  )
}

export default memo(PWAInfo)
