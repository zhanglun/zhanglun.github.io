import React, { useState, useEffect, useRef } from 'react'
// import TRUNK from 'vanta/dist/vanta.trunk.min'
import TRUNK from 'vanta/dist/vanta.topology.min'
import "./index.css"

export const Banner = ({ description }) => {
  const [vantaEffect, setVantaEffect] = useState<any>()
  const myRef = useRef(null)

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(TRUNK({
        el: myRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00
      }))
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <div className="banner" ref={myRef}>
      <div className="banner-title">{description}</div>
    </div>
  )
}
