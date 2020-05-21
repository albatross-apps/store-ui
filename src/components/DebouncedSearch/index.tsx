import React, { memo, useEffect, useRef } from "react"
import { IonSearchbar } from "@ionic/react"

interface ContainerProps {
  delay?: number
  onChangeCallback: (value: string) => void
}

const DebouncedSearch: React.FC<ContainerProps> = ({
  delay = 400,
  onChangeCallback,
}) => {
  let ref = useRef<any>(null)

  useEffect(() => {
    if (ref) {
      ref.current.getInputElement().then((input: any) => {
        ref.current.setFocus()
      })
    }
  }, [ref])

  const handleOnChangeCallback = async (e: CustomEvent) => {
    const { value } = e.detail
    onChangeCallback(value)
  }

  return (
    <IonSearchbar
      onIonChange={handleOnChangeCallback}
      debounce={delay}
      ref={ref}
    />
  )
}

export default memo(DebouncedSearch)
