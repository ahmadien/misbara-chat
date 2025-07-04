import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'
import { useAppState } from '../store'

const LanguageSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text x="12" y="16" text-anchor="middle" font-size="12" font-family="Arial" fill="${encodeURIComponent('#fff')}" stroke="${encodeURIComponent('#000')}" stroke-width="0.5">AR</text></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
        ...(theme.applyStyles && theme.applyStyles('dark', { backgroundColor: '#8796A5' })),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text x="12" y="16" text-anchor="middle" font-size="12" font-family="Arial" fill="${encodeURIComponent('#fff')}" stroke="${encodeURIComponent('#000')}" stroke-width="0.5">EN</text></svg>')`,
    },
    ...(theme.applyStyles && theme.applyStyles('dark', { backgroundColor: '#003892' })),
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
    ...(theme.applyStyles && theme.applyStyles('dark', { backgroundColor: '#8796A5' })),
  },
}));

export function TopBar() {
  const { language, setLanguage } = useAppState()

  return (
    <div
      className={`fixed top-0 z-20 flex items-center gap-4 p-4 ${
        language === 'ar' ? 'left-0' : 'right-0'
      }`}
    >
      <LanguageSwitch
        checked={language === 'ar'}
        onChange={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      />
    </div>
  )
}
