import { useState, useCallback } from 'react'

export function useImage() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  const loadFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setImage(img)
      URL.revokeObjectURL(url)
    }
    img.src = url
  }, [])

  return { image, loadFile }
}
