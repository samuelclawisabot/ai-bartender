import '../styles/_globals.css'

export default function App({ 
  Component, 
  pageProps 
}: { 
  Component: any; 
  pageProps: any 
}) {
  return <Component {...pageProps} />
}
