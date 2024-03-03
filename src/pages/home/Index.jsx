import React, { lazy, Suspense } from 'react'
import Scrolling2 from '../../components/Home/Newest/Scrolling2'
import Hero4Normal from '../../components/Home/HeroSection/HeroBackground/Normal/Hero4/Hero4Normal'
import FixedCardMostSeller from '../../components/Home/FixedCard/MostSeller/FixedCardMostSeller'
import AboutVideo from '../../components/Home/About/AboutVideo'

const AnalyticsMetaTags = lazy(() =>
  import('../../components/analyticsMetaTags/AnalyticsMetaTags')
)
const Index = () => {
  return (
    <>
      <Hero4Normal />
      <FixedCardMostSeller />
      <AboutVideo />
      <Scrolling2 />
      <Suspense fallback={<div>Loading...</div>}>
        <AnalyticsMetaTags />
      </Suspense>
    </>
  )
}

export default Index
