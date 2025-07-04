import * as React from 'react'
import logoUrl from './misbara_full_logo.svg'

export const BrandLogo = (
  props: React.ImgHTMLAttributes<HTMLImageElement>
) => <img src={logoUrl} alt="Misbara logo" width={40} {...props} />
