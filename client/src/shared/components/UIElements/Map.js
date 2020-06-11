import React, { useRef, useEffect } from 'react'

import './Map.css'

const Map = props => {
  const mapRef = useRef()

  const { center, zoom, title } = props

  useEffect(() => {
    //eslint-disable-next-line
    const map = new AMap.Map(mapRef.current, {
      //eslint-disable-next-line
      center: [center.lng, center.lat],
      zoom: zoom,
    });
    //eslint-disable-next-line
    const marker = new AMap.Marker({
      //eslint-disable-next-line
      position: [center.lng, center.lat],
      title: title,
    });
    map.add(marker)
  }, [center, zoom, title])
  
  return (
    <div ref={mapRef} className={`map ${props.className}`} style={props.style}></div>
  )
}

export default Map