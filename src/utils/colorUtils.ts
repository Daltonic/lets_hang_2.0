// File: src/utils/colorUtils.ts
import { type RefObject } from 'react'

interface GradientColors {
  primary: string
  secondary: string
  accent: string
}

export const rgbToHsl = (
  r: number,
  g: number,
  b: number,
): [number, number, number] => {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return [h * 360, s * 100, l * 100]
}

export const getColorVibrancy = (r: number, g: number, b: number): number => {
  const [, s, l] = rgbToHsl(r, g, b)
  return s * (1 - Math.abs(l - 50) / 50)
}

export const toHex = (r: number, g: number, b: number): string =>
  '#' +
  [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('')

export const hslToRgb = (
  h: number,
  s: number,
  l: number,
): [number, number, number] => {
  s /= 100
  l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r1 = 0,
    g1 = 0,
    b1 = 0
  if (h < 60) {
    r1 = c
    g1 = x
    b1 = 0
  } else if (h < 120) {
    r1 = x
    g1 = c
    b1 = 0
  } else if (h < 180) {
    r1 = 0
    g1 = c
    b1 = x
  } else if (h < 240) {
    r1 = 0
    g1 = x
    b1 = c
  } else if (h < 300) {
    r1 = x
    g1 = 0
    b1 = c
  } else {
    r1 = c
    g1 = 0
    b1 = x
  }

  return [
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255),
  ]
}

export const adjustColorForGradient = (
  r: number,
  g: number,
  b: number,
  boost: boolean = false,
): string => {
  const hsl = rgbToHsl(r, g, b)
  const h = hsl[0]
  let s = hsl[1]
  let l = hsl[2]

  if (boost) {
    s = Math.min(100, s < 40 ? s + 30 : s * 1.2)
    if (l < 40) l = 40 + (l / 40) * 20
    else if (l > 70) l = 70 - ((l - 70) / 30) * 20
  }

  const [newR, newG, newB] = hslToRgb(h, s, l)
  return toHex(newR, newG, newB)
}

export const extractGradient = (
  imageUrl: string,
  canvasRef: RefObject<HTMLCanvasElement | null>,
): Promise<GradientColors> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'

    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) {
        resolve({ primary: '#ff4da6', secondary: '#a87aff', accent: '#6688ff' })
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve({ primary: '#ff4da6', secondary: '#a87aff', accent: '#6688ff' })
        return
      }

      const maxSize = 200
      const scale = Math.min(maxSize / img.width, maxSize / img.height)
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      interface ColorSample {
        rgb: [number, number, number]
        vibrancy: number
        brightness: number
      }

      const samples: ColorSample[] = []
      const sampleCount = 100

      for (let i = 0; i < sampleCount; i++) {
        const x = Math.floor(Math.random() * canvas.width)
        const y = Math.floor(Math.random() * canvas.height)
        const index = (y * canvas.width + x) * 4

        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        const a = data[index + 3]

        if (a < 128) continue

        const brightness = (r + g + b) / 3
        const vibrancy = getColorVibrancy(r, g, b)

        samples.push({
          rgb: [r, g, b],
          vibrancy,
          brightness,
        })
      }

      const filteredSamples = samples.filter(
        (s) => s.brightness > 35 && s.brightness < 220,
      )

      const workingSamples =
        filteredSamples.length > 10 ? filteredSamples : samples

      if (workingSamples.length === 0) {
        resolve({ primary: '#ff4da6', secondary: '#a87aff', accent: '#6688ff' })
        return
      }

      workingSamples.sort((a, b) => b.vibrancy - a.vibrancy)

      const selectColor = (index: number, boost: boolean = false): string => {
        if (index >= workingSamples.length) {
          index = workingSamples.length - 1
        }
        const [r, g, b] = workingSamples[index].rgb
        return adjustColorForGradient(r, g, b, boost)
      }

      const avgVibrancy =
        workingSamples.reduce((sum, s) => sum + s.vibrancy, 0) /
        workingSamples.length
      const needsBoost = avgVibrancy < 30

      const primary = selectColor(0, needsBoost)
      let secondary = selectColor(
        Math.floor(workingSamples.length / 2),
        needsBoost,
      )
      let accent = selectColor(
        Math.floor(workingSamples.length * 0.75),
        needsBoost,
      )

      const areSimilar = (hex1: string, hex2: string): boolean => {
        const rgb1 = hex1.match(/\w\w/g)?.map((x) => parseInt(x, 16)) || [
          0, 0, 0,
        ]
        const rgb2 = hex2.match(/\w\w/g)?.map((x) => parseInt(x, 16)) || [
          0, 0, 0,
        ]
        const diff = Math.sqrt(
          Math.pow(rgb1[0] - rgb2[0], 2) +
            Math.pow(rgb1[1] - rgb2[1], 2) +
            Math.pow(rgb1[2] - rgb2[2], 2),
        )
        return diff < 50
      }

      if (areSimilar(primary, secondary) || areSimilar(primary, accent)) {
        const baseRgb = primary.match(/\w\w/g)?.map((x) => parseInt(x, 16)) || [
          0, 0, 0,
        ]
        const [h, s, l] = rgbToHsl(baseRgb[0], baseRgb[1], baseRgb[2])

        const [r2, g2, b2] = hslToRgb((h + 30) % 360, Math.min(100, s + 20), l)
        secondary = adjustColorForGradient(r2, g2, b2, true)

        const [r3, g3, b3] = hslToRgb(
          (h + 60) % 360,
          Math.min(100, s + 10),
          Math.min(80, l + 10),
        )
        accent = adjustColorForGradient(r3, g3, b3, true)
      }

      resolve({ primary, secondary, accent })
    }

    img.onerror = () => {
      resolve({ primary: '#ff4da6', secondary: '#a87aff', accent: '#6688ff' })
    }

    img.src = imageUrl
  })
}
