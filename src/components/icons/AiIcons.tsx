import * as React from 'react'
import animatedLogoUrl from './animated_ai_logo.svg'
import originalLogoUrl from './misbara_original_logo.svg'

export const AnimatedAiIcon = (
  props: React.ImgHTMLAttributes<HTMLImageElement>
) => <img src={animatedLogoUrl} alt="Misbara animated logo" {...props} />

export const AiIcon = (
  props: React.ImgHTMLAttributes<HTMLImageElement>
) => <img src={originalLogoUrl} alt="Misbara logo" {...props} />
