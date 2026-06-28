import React from 'react'

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">

      {/* video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="/RL_video.mp4" type="video/mp4" />

          </video>

          <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 class="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 bg-gradient-to-r from-gray-100 via-yellow-300 to-rose-400 bg-clip-text text-transparent">
            Timeless Bangles
            <span className="block bg-gradient-to-r from-yellow-200 via-amber-300 to-pink-400  bg-clip-text text-transparent">
              for Modern Souls
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 font-medium mb-10 max-w-2xl mx-auto leading-relaxed flex flex-col">
            Discover exquisite handcrafted bangles that blend tradition with contemporary elegance. 
            Perfect for every occasion.
           <span className='font-bold text-3xl'>Specilization in Big Sizes: 2-10, 2-12, 2-14</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <a 
              href="Collection"
              className="group bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 flex items-center space-x-3 bg-gray-50/20"
            >
              <span className='text-[#f8f3f3]'>Shop Collection</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="flex flex-col items-center space-y-2 animate-bounce">
            <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent"></div>
            <p className="text-sm text-white font-medium">Scroll to Explore</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero