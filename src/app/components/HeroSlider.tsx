
"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    title: "Discover Your Next Favorite Book",
    description:
      "Explore a world of stories, knowledge, and imagination. Find your next great read at BookNook.",
    button: "Browse Books",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600",
  },
  {
    title: "A World of Knowledge Awaits",
    description:
      "From science to history, discover books that inspire curiosity and help you learn something new.",
    button: "Explore Collection",
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1600",
  },
  {
    title: "Read More, Discover More",
    description:
      "Find inspiring stories, borrow your favorite books, and make reading a part of your everyday life.",
    button: "Start Reading",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600",
  },
];

export default function HeroSlider() {
  return (
    <section className="mx-auto max-w-7xl overflow-hidden rounded-2xl">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation
        className="hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative flex min-h-[420px] items-center bg-cover bg-center px-8 py-16 md:min-h-[520px] md:px-16"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.82), rgba(0,0,0,0.25)), url("${slide.image}")`,
              }}
            >
              <div className="relative z-10 max-w-2xl text-white">
                <span className="mb-4 inline-block rounded-full bg-primary px-4 py-2 text-sm font-semibold">
                  Welcome to BookNook
                </span>

                <h1 className="mb-5 text-3xl font-black leading-tight md:text-5xl">
                  {slide.title}
                </h1>

                <p className="mb-8 max-w-xl text-base leading-7 text-gray-200 md:text-lg">
                  {slide.description}
                </p>

                <Link
                  href="/books"
                  className="btn btn-primary border-none px-8 text-white"
                >
                  {slide.button}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
