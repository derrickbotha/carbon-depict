import { Outlet } from 'react-router-dom'
import Navbar from '@organisms/Navbar'
import Footer from '@organisms/Footer'

/**
 * MarketingLayout - Layout wrapper for marketing pages
 * Includes Navbar and Footer
 */
export default function MarketingLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-18">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
