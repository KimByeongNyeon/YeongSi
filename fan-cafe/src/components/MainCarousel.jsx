import React, { useState, useEffect } from "react";
import heroImage1 from "../images/fanmeeting-hero.jpg";
import heroImage2 from "../images/hero-concert2.jpg";
import heroImage3 from "../images/hero.jpg";
const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: heroImage1,
      title: "YeongSi와 함께 하세요!",
      subTitle: "임영웅, 영웅시대 화이팅!!",
    },
    {
      image: heroImage2,
      title: "Favorite YeongSi",
      subTitle: "가장 인기 있는 공연은??",
    },
    {
      image: heroImage3,
      title: "Little Community",
      subTitle: "오직 영시만을 위한 공간",
    },
  ];

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <img src={slides[currentSlide].image} alt="" className="w-full h-full object-cover" />
        {/* 그라데이션 오버레이 - 더 강한 대비 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col">
        {/* 상단 컨텐츠 영역 */}
        <div className="flex-1 flex items-center">
          {" "}
          {/* flex-1과 items-center 추가 */}
          {slides.map((slide, index) => (
            <div key={index} className={`transition-opacity duration-1000 ${currentSlide === index ? "opacity-100" : "opacity-0 absolute"}`}>
              <span className="inline-block px-4 py-1 bg-blue-600/90 text-white text-sm font-medium rounded-full mb-6">HERO</span>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">{slide.title}</h1>
              <p className="text-xl md:text-2xl text-white/90 font-medium mb-3 leading-relaxed">{slide.subTitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 정보 카드 */}
      <div className="absolute bottom-8 left-0 right-0 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 다음 공연 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
            <span className="text-blue-400 text-sm font-medium mb-2 block">다음 공연</span>
            <h3 className="text-2xl font-bold text-white mb-1">서울 콘서트</h3>
            <p className="text-white/80">2024.04.15</p>
          </div>

          {/* 최신 앨범 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
            <span className="text-blue-400 text-sm font-medium mb-2 block">최신 앨범</span>
            <h3 className="text-2xl font-bold text-white mb-1">별빛 같은 사랑</h3>
            <p className="text-white/80">2024.03.01 발매</p>
          </div>

          {/* 팬미팅 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
            <span className="text-blue-400 text-sm font-medium mb-2 block">팬미팅</span>
            <h3 className="text-2xl font-bold text-white mb-1">히어로 팬미팅</h3>
            <p className="text-white/80">신청 마감 D-7</p>
          </div>

          {/* TV 출연 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
            <span className="text-blue-400 text-sm font-medium mb-2 block">TV 출연</span>
            <h3 className="text-2xl font-bold text-white mb-1">불후의 명곡</h3>
            <p className="text-white/80">3월 15일 방송</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
