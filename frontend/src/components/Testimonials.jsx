import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, BadgeCheck, Building2 } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Chief Information Security Officer",
    company: "HealthFirst Solutions",
    image: "/api/placeholder/64/64",
    quote: "The platform's end-to-end encryption and HIPAA compliance features have been crucial for our medical practice. File transfers are seamless, and the audit trails give us peace of mind for compliance reporting.",
    rating: 5,
    date: "2025-02-15",
    sector: "Healthcare"
  },
  {
    name: "Marcus Rodriguez",
    role: "Senior Partner",
    company: "Rodriguez & Associates Legal",
    image: "/api/placeholder/64/64",
    quote: "As a law firm handling sensitive client data, security is paramount. This platform's granular permissions and secure sharing features have transformed how we collaborate with clients and partner firms.",
    rating: 5,
    date: "2025-02-10",
    sector: "Legal"
  },
  {
    name: "Dr. Emily Walsh",
    role: "Director of Telemedicine",
    company: "Metro Medical Center",
    image: "/api/placeholder/64/64",
    quote: "The intuitive interface made adoption across our medical staff seamless. The ability to securely share large imaging files and maintain patient confidentiality has been invaluable.",
    rating: 5,
    date: "2025-02-01",
    sector: "Healthcare"
  },
  {
    name: "James Wilson",
    role: "IT Director",
    company: "Global Finance Corp",
    image: "/api/placeholder/64/64",
    quote: "Implementation was smooth and the platform integrated perfectly with our existing workflow. The advanced encryption and detailed activity logs exceed our strict financial security requirements.",
    rating: 4,
    date: "2025-01-28",
    sector: "Finance"
  },
  {
    name: "Lisa Thompson",
    role: "Operations Manager",
    company: "Innovate Tech Solutions",
    image: "/api/placeholder/64/64",
    quote: "The mobile responsiveness and real-time collaboration features have greatly improved our team's productivity. We especially appreciate the instant notifications and version control.",
    rating: 5,
    date: "2025-01-20",
    sector: "Technology"
  },
  {
    name: "David Park",
    role: "Compliance Officer",
    company: "SecureBank Financial",
    image: "/api/placeholder/64/64",
    quote: "The platform's robust security features and detailed audit trails make compliance reporting a breeze. Customer support has been exceptional in addressing our specific regulatory requirements.",
    rating: 5,
    date: "2025-01-15",
    sector: "Finance"
  }
];

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  const minSwipeDistance = 50;
  const cardsToShow = useRef(3);
  const totalSlides = useRef(Math.ceil(testimonials.length / cardsToShow.current));

  useEffect(() => {
    const updateCardsToShow = () => {
      cardsToShow.current = window.innerWidth < 768 ? 1 : 3;
      totalSlides.current = Math.ceil(testimonials.length / cardsToShow.current);
    };

    updateCardsToShow();
    window.addEventListener('resize', updateCardsToShow);

    return () => window.removeEventListener('resize', updateCardsToShow);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides.current);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides.current) % totalSlides.current);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const distance = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - distance;
  };

  const onMouseUp = () => {
    setIsDragging(false);
    const currentScroll = carouselRef.current.scrollLeft;
    const slideWidth = carouselRef.current.offsetWidth;
    const newSlide = Math.round(currentScroll / slideWidth);
    goToSlide(newSlide);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, 4000);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, nextSlide]);

  const averageRating = (testimonials.reduce((acc, curr) => acc + curr.rating, 0) / testimonials.length).toFixed(1);

  return (
    <div className="relative w-full overflow-hidden" >
                  {/* <div className="absolute inset-0 bg-gradient-to-r from-[#E7F5FD] to-[#FCEBE0]" /> */}
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E7F5FD] to-[#FCEBE0]">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          // backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" /> */}
      </div>

      {/* Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative h-screen max-w-9xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-22">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 lg:text-4xl">
            Trusted by Thousands of Professionals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join over <span className="font-semibold text-blue-700">10,000</span> satisfied users who trust us with their secure communications.
            Average rating of <span className="font-semibold text-blue-700">{averageRating}</span> out of 5 stars.
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div
            ref={carouselRef}
            className="overflow-hidden touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * (100 / cardsToShow.current)}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`w-full sm:w-1/3 flex-shrink-0 px-3`}
                >
                  <div className="group h-full">
                    <div className="h-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-blue-50 hover:border-blue-100 transform hover:-translate-y-1">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="relative flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500/80 ring-offset-2"
                          />
                          <BadgeCheck className="absolute -bottom-1 -right-1 w-6 h-6 text-blue-500 bg-white rounded-full" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {testimonial.name}
                          </h3>
                          <p className="text-blue-600 font-medium">{testimonial.role}</p>
                          <div className="flex items-center text-gray-600">
                            <Building2 className="w-4 h-4 mr-1" />
                            {testimonial.company}
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-2 -top-2 text-blue-500/20 text-6xl font-serif select-none group-hover:scale-110 transition-transform"></div>
                        <p className="text-gray-700 relative z-10 pl-4 text-base leading-relaxed group-hover:text-gray-900 transition-colors">
                          {testimonial.quote}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-blue-50">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 transition-all duration-300 ${i < testimonial.rating
                                ? 'text-blue-500 fill-current group-hover:text-yellow-400'
                                : 'text-gray-300 group-hover:text-gray-400'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full group-hover:bg-blue-100 transition-colors">
                          {new Date(testimonial.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-white/80 backdrop-blur-sm text-blue-600 rounded-full p-3 shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-white/80 backdrop-blur-sm text-blue-600 rounded-full p-3 shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="flex justify-center mt-8 gap-2">
            {[...Array(totalSlides.current)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index
                  ? 'bg-blue-600 ring-2 ring-blue-200 scale-125'
                  : 'bg-blue-200 hover:bg-blue-300 hover:scale-110'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
