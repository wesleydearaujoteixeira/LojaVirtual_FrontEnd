import React from 'react'
import { Swiper, SwiperSlide} from 'swiper/react'


import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Image from 'next/image'
import { Navigation, Pagination, Autoplay} from 'swiper/modules'

const Carrossel = () => {
  const images = [
    '/lenovo.avif',
    '/motorola.avif',
    '/samsung.avif',
    '/imagem.webp',
    '/iphone.png'
  ]

  return (
    <Swiper
      navigation
      pagination={{ clickable: true }}
        modules={[Navigation, Pagination, Autoplay]}
      autoplay={{ delay: 4000 }}
      loop={true}
      spaceBetween={30}
      slidesPerView={1}
      style={{ width: '1000px', height: '300px' }}
    >
      {images.map((src, index) => (
        <SwiperSlide key={index}>
          <div style={{ position: 'relative', width: '100%', height: '300px' }}>
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              priority={true}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default Carrossel
