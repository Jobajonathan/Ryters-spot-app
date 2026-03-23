import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HomePage from './(public)/page'

export { metadata } from './layout'

export default function RootPage() {
  return (
    <>
      <Navbar />
      <main>
        <HomePage />
      </main>
      <Footer />
    </>
  )
}
