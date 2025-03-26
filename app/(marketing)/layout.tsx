import localFont from 'next/font/local'

const playfairDisplay = localFont({
  src: [
    {
      path: '../../fonts/Playfair_Display/static/PlayfairDisplay-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/Playfair_Display/static/PlayfairDisplay-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../fonts/Playfair_Display/static/PlayfairDisplay-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
})

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className={playfairDisplay.className}>{children}</div>
}