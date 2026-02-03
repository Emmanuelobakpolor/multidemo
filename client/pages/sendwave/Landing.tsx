import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Play, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const GCashLanding = () => {
  const navigate = useNavigate();
  const [currentPromo, setCurrentPromo] = useState(0);
  const [currentNews, setCurrentNews] = useState(0);

  const promos = [
    {
      tag: "PROMOS",
      title: "Get ₱1,500 rebate when you pay with GCash",
      desc: "Get free ₱1,500 worth of rebates for your first 3 bills payment",
      countdown: { days: "29", hours: "18", mins: "14" },
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      color: "from-blue-500 to-cyan-400"
    },
    {
      tag: "LIFESTYLE",
      title: "Shop Now, Pay Later with GCredit",
      desc: "Create an account for a 5,000 credit limit, no interest",
      countdown: { days: "15", hours: "12", mins: "30" },
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop",
      color: "from-purple-500 to-pink-400"
    },
    {
      tag: "GAMING",
      title: "Topup na! Get up to 40% cashback on games",
      desc: "Play your fave games with discounts up to ₱200",
      countdown: { days: "7", hours: "8", mins: "45" },
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
      color: "from-green-500 to-emerald-400"
    }
  ];

  const newsItems = [
    {
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop",
      tag: "AWARDS",
      title: "GCash bags 4 recognitions at prestigious Stevie Awards",
      link: "Read More"
    },
    {
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=250&fit=crop",
      tag: "FINTECH",
      title: "GCash joins forces with Shopee to enhance Fintech program",
      link: "Read More"
    },
    {
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop",
      tag: "HR",
      title: "GCash bags 'HR Asia Best Companies to Work for in Asia 2023' award",
      link: "Read More"
    },
    {
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop",
      tag: "AWARDS",
      title: "GCash wins big at the prestigious HR Excellence Awards 2023",
      link: "Read More"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#007DFE] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <span className="font-bold text-[#007DFE] text-xl">GCash</span>
              </Link>
              <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600">
                <a href="#" className="hover:text-[#007DFE] transition">Get Started</a>
                <a href="#" className="hover:text-[#007DFE] transition">Services</a>
                <a href="#" className="hover:text-[#007DFE] transition">Partners</a>
                <a href="#" className="hover:text-[#007DFE] transition">About Us</a>
                <a href="#" className="hover:text-[#007DFE] transition">FAQs</a>
                <a href="#" className="hover:text-[#007DFE] transition">Promos</a>
                <a href="#" className="hover:text-[#007DFE] transition">Careers</a>
                <a href="#" className="hover:text-[#007DFE] transition">Help Center</a>
              </nav>
            </div>
            <Link
              to="/sendwave/register"
              className="px-6 py-2.5 bg-[#007DFE] text-white rounded-full font-semibold text-sm hover:bg-blue-600 transition shadow-md"
            >
              Get GCash
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Matching GCash style */}
      <section className="relative bg-gradient-to-br from-[#E8F4FD] via-[#D4ECFD] to-[#C0E4FC] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative min-h-[500px] lg:min-h-[600px]">
            {/* Background Image - Woman */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1400&h=800&fit=crop&crop=faces"
                alt="Happy woman"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#E8F4FD]/90 via-[#E8F4FD]/60 to-transparent"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-12 pb-32">
              {/* Floating App Badge */}
              <div className="absolute top-8 right-1/3 hidden lg:flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <div className="w-6 h-6 bg-[#007DFE] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">G</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">Cashless</span>
              </div>

              {/* Main Hero Content */}
              <div className="max-w-xl pt-8">
                <span className="inline-block px-3 py-1 bg-[#007DFE] text-white text-xs font-bold rounded-full mb-4">
                  New
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a365d] leading-tight mb-6">
                  Sabayan ang pag-<br />
                  angat ng fave<br />
                  brands mo
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                  Discover more →
                </p>
              </div>

              {/* Stock Ticker Style Cards */}
              <div className="absolute bottom-8 left-4 right-4 sm:left-8 sm:right-8 flex gap-4 overflow-x-auto pb-4">
                <div className="flex-shrink-0 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg min-w-[160px]">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="https://logo.clearbit.com/jollibee.com.ph" alt="JFC" className="w-8 h-8 rounded-full" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/32'; }} />
                    <span className="font-bold text-gray-800">JFC</span>
                    <span className="text-green-500 text-sm font-semibold">+65%</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">134</span>
                    <span className="text-gray-500">223</span>
                  </div>
                </div>

                <div className="flex-shrink-0 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg min-w-[160px]">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="https://logo.clearbit.com/bpi.com.ph" alt="BPI" className="w-8 h-8 rounded-full" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/32'; }} />
                    <span className="font-bold text-gray-800">BPI</span>
                    <span className="text-green-500 text-sm font-semibold">+10.41%</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">51</span>
                    <span className="text-gray-500">125</span>
                  </div>
                </div>

                <div className="flex-shrink-0 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg min-w-[160px]">
                  <div className="flex items-center gap-2 mb-2">
                    <img src="https://logo.clearbit.com/globe.com.ph" alt="GLO" className="w-8 h-8 rounded-full" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/32'; }} />
                    <span className="font-bold text-gray-800">GLO</span>
                    <span className="text-red-500 text-sm font-semibold">-2.3%</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">2,180</span>
                    <span className="text-gray-500">2,230</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-4 right-8 flex items-center gap-3 z-20">
              <button className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow hover:bg-white transition">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-8 h-8 rounded-full bg-[#007DFE] flex items-center justify-center shadow hover:bg-blue-600 transition">
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Promos Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[#007DFE] text-sm font-semibold">Promos</span>
              <h2 className="text-3xl font-bold text-gray-900">
                Treat yourself to exciting promos
              </h2>
            </div>
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition">
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {promos.map((promo, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${promo.color} opacity-60`}></div>
                  <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                    <h3 className="font-bold text-lg leading-tight">{promo.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-[#007DFE] text-xs font-semibold rounded">
                      {promo.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-gray-900">{promo.countdown.days}</span>
                      <span className="text-gray-500">D</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-gray-900">{promo.countdown.hours}</span>
                      <span className="text-gray-500">H</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-gray-900">{promo.countdown.mins}</span>
                      <span className="text-gray-500">M</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">{promo.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0052CC] to-[#003D99] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-blue-200 mb-2">Hindi madaling magpumilit ulit.</p>
          <p className="text-blue-200 mb-4">Pero 'di ibig sabihin na imposible 'to.</p>
          <h2 className="text-4xl sm:text-5xl font-bold mb-12">
            Watch the latest GCash Story
          </h2>

          <div className="relative max-w-4xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-gray-900">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&h=675&fit=crop"
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Video Content Overlay */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="text-xs text-gray-300">GCash Stories: Rhea | Official Full Film</span>
              </div>

              <div className="absolute top-6 right-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#007DFE] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">G</span>
                </div>
                <span className="font-bold text-white">GCash</span>
              </div>

              {/* Play Button */}
              <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition shadow-xl">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </button>

              {/* Video Title */}
              <div className="absolute bottom-8 left-8 text-left">
                <h3 className="text-6xl font-black text-white mb-2">Rhea</h3>
                <p className="text-lg text-gray-300">Official Full Film</p>
                <p className="text-sm text-gray-400">Directed by Borgy Torre</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[#007DFE] font-bold">#GCashStories</span>
                </div>
              </div>

              {/* YouTube Badge */}
              <div className="absolute bottom-8 right-8">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span>Watch on</span>
                  <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                    <Play className="w-4 h-4 text-red-500 fill-red-500" />
                    <span className="font-semibold">YouTube</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition">
                <ChevronRight className="w-5 h-5 text-[#007DFE]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* GNation Reads Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[#007DFE] text-sm font-semibold">Articles</span>
              <h2 className="text-3xl font-bold text-gray-900">
                GNation Reads
              </h2>
            </div>
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-white transition">
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs font-semibold text-gray-500 uppercase">{item.tag}</span>
                  <h3 className="font-bold text-gray-900 mt-2 mb-3 line-clamp-3 text-sm leading-snug">
                    {item.title}
                  </h3>
                  <a href="#" className="text-[#007DFE] text-sm font-semibold hover:underline">
                    {item.link}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {[0, 1, 2, 3, 4, 5].map((dot) => (
              <button
                key={dot}
                className={`w-2 h-2 rounded-full transition ${dot === 0 ? 'bg-[#007DFE]' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Strength in Numbers - Bento Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-16">
            Strength, in numbers
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* 94M Card */}
            <div className="relative rounded-3xl overflow-hidden h-64 lg:h-80 group">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop"
                alt="Users"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">Registered</span>
              </div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-5xl lg:text-6xl font-black">94M</p>
                <p className="text-sm mt-2">Filipinos have used GCash</p>
              </div>
            </div>

            {/* Over 9M Card */}
            <div className="relative rounded-3xl overflow-hidden h-64 lg:h-80 bg-[#E8F4FD] group">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop"
                  alt="Savings"
                  className="w-3/4 h-3/4 object-contain"
                />
              </div>
              <div className="absolute bottom-6 left-6 text-gray-900">
                <p className="text-4xl lg:text-5xl font-black">Over 9M Filipinos</p>
                <p className="text-sm mt-2">with savings via GSave</p>
              </div>
            </div>

            {/* 6M Merchants Card */}
            <div className="relative rounded-3xl overflow-hidden h-64 lg:h-80 group">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
                alt="Merchants"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-5xl lg:text-6xl font-black">6M merchants</p>
                <p className="text-sm mt-2">and social sellers on the app</p>
              </div>
            </div>

            {/* 200+ Countries Card */}
            <div className="relative rounded-3xl overflow-hidden h-64 lg:h-80 bg-[#F0F9FF] group">
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <p className="text-5xl lg:text-6xl font-black text-gray-900">200+</p>
                  <p className="text-sm mt-2 text-gray-600">Countries with Filipino GCash Users</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200 to-transparent rounded-bl-full"></div>
            </div>

            {/* 3M+ Active Users */}
            <div className="relative rounded-3xl overflow-hidden h-64 lg:h-80 bg-gradient-to-br from-blue-500 to-cyan-400 group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/40"></div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-5xl lg:text-6xl font-black">3M+</p>
                <p className="text-sm mt-2">Active daily (5 hours)</p>
              </div>
            </div>

            {/* Over 3M Borrowers Card */}
            <div className="relative rounded-3xl overflow-hidden h-64 lg:h-80 group">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop"
                alt="Finance"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white rounded-2xl px-6 py-4 shadow-xl">
                  <p className="text-2xl font-black text-gray-900">₱25,000.00</p>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-4xl lg:text-5xl font-black">Over 3M borrowers</p>
                <p className="text-sm mt-2">through GLoan, GSave, and GCredit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* #1 Finance App Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#E8F4FD] to-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Phone Mockup */}
            <div className="relative">
              <div className="relative mx-auto w-64 lg:w-80">
                {/* Phone Frame */}
                <div className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-800">
                  <div className="bg-[#007DFE] pt-12 pb-6 px-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                        <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-blue-100 text-xs">Available Balance</p>
                    <p className="text-white text-3xl font-bold">₱24,875.40</p>
                  </div>
                  <div className="p-4 space-y-3">
                    {['Cash In', 'Send', 'Bank', 'Pay Bills'].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="w-5 h-5 bg-[#007DFE] rounded"></div>
                        </div>
                        <span className="font-medium text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Notch */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-black rounded-full"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 rounded-full opacity-60 blur-xl"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-cyan-200 rounded-full opacity-60 blur-xl"></div>
            </div>

            {/* Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-12 bg-[#007DFE] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
              </div>
              <p className="text-gray-600 text-lg mb-4">
                GCash is consistently one of the top apps, and the{" "}
                <span className="font-bold text-gray-900">#1 Finance Mobile App.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Help CTA Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-[#007DFE]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-white text-xl font-bold">
            Got questions about GCash?
          </h3>
          <Link
            to="/help"
            className="px-6 py-3 bg-white text-[#007DFE] rounded-full font-semibold hover:bg-gray-100 transition flex items-center gap-2"
          >
            Visit Help Center
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#007DFE] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <span className="font-bold text-[#007DFE] text-xl">GCash</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                © GCash Inc. 2025 All rights reserved. Unit 15, Barangay
                Carmona, Laguna 4116 (02) 8520 0000 phone services fee may
                apply
              </p>
              <p className="text-sm text-gray-500">
                M4 Global Solutions Inc. - EMI | 1st Floor, Richford Business
                Center, Rizal City, Taguig, Philippines
              </p>
            </div>

            {/* Get Started */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Get Started</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#007DFE]">Lite, Earned</a></li>
                <li><a href="#" className="hover:text-[#007DFE]">Basic Account</a></li>
                <li><a href="#" className="hover:text-[#007DFE]">Fully Verified</a></li>
                <li><a href="#" className="hover:text-[#007DFE]">GCredit</a></li>
                <li><a href="#" className="hover:text-[#007DFE]">GSave</a></li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#007DFE]">Send Money</a></li>
                <li><a href="#" className="hover:text-[#007DFE]">Cash In/Out</a></li>
                <li><a href="#" className="hover:text-[#007DFE]">Pay Bills</a></li>
                <li><a href="#" className="hover:text-[#007DFE]">Buy Load</a></li>
                <li><a href="#" className="hover:text-[#007DFE]">Online Shopping</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#007DFE]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#007DFE]">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#007DFE]">Security</a></li>
              </ul>

              {/* App Store Badges */}
              <div className="mt-6 flex gap-3">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="App Store"
                  className="h-10"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <p>We use cookies to enhance your browsing experience. By continuing to use this site you consent to our use of cookies. Read our <a href="#" className="text-[#007DFE]">Cookie Policy</a></p>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-[#007DFE] text-white rounded-full font-medium">Accept All</button>
              <button className="px-4 py-2 border border-gray-300 rounded-full font-medium hover:bg-gray-50">Reject All</button>
              <button className="px-4 py-2 border border-gray-300 rounded-full font-medium hover:bg-gray-50">Customize</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GCashLanding;