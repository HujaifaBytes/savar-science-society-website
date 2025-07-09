"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { IMAGES, SOCIAL_LINKS } from "@/lib/image-paths"
import { OLYMPIAD_PHOTOS } from "@/lib/google-drive-utils"
import { getAdmitCardSetting } from "@/lib/actions"
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  BookOpen,
  Star,
  ArrowRight,
  Phone,
  Mail,
  Award,
  Zap,
  Sparkles,
  Rocket,
  Brain,
  Atom,
  ChevronDown,
  Play,
  Pause,
} from "lucide-react"
import { GoogleDriveImage } from "@/components/google-drive-image"

// Throttle function for performance
const throttle = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout
  let lastExecTime = 0
  return function (this: any, ...args: any[]) {
    const currentTime = Date.now()
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args)
      lastExecTime = currentTime
    } else {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(
        () => {
          func.apply(this, args)
          lastExecTime = Date.now()
        },
        delay - (currentTime - lastExecTime),
      )
    }
  }
}

export default function HomePage() {
  const [admitCardEnabled, setAdmitCardEnabled] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("hero")
  const heroRef = useRef<HTMLDivElement>(null)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    const checkAdmitCard = async () => {
      const result = await getAdmitCardSetting()
      if (result.success) {
        setAdmitCardEnabled(result.enabled)
      }
    }

    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
      setIsVisible(true)
    }, 1500)

    checkAdmitCard()

    const handleScroll = throttle(() => {
      setScrollY(window.scrollY)

      const sections = ["hero", "about", "gallery", "details", "contact"]
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (currentSection) setActiveSection(currentSection)
    }, 16)

    window.addEventListener("scroll", handleScroll, { passive: true })

    const photoInterval = setInterval(() => {
      if (isAutoPlay) {
        setCurrentPhotoIndex((prev) => (prev + 1) % OLYMPIAD_PHOTOS.length)
      }
    }, 4000)

    return () => {
      clearTimeout(loadingTimer)
      window.removeEventListener("scroll", handleScroll)
      clearInterval(photoInterval)
    }
  }, [isAutoPlay])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-cyan-400/30 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Atom className="h-8 w-8 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Olympiad 3.0</h2>
          <p className="text-cyan-300 animate-pulse">Preparing the future of science...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-90 transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <Image
                  src={IMAGES.LOGO || "/placeholder.svg"}
                  alt="Savar Science Society Logo"
                  width={50}
                  height={50}
                  className="rounded-full relative z-10 ring-2 ring-cyan-400/30"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                  Savar Science Society
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">Inspiring Future Scientists</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <MainNav />
            <ThemeToggle />
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
              transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.05}px)`,
            }}
          />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-geometric"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 4}s`,
              }}
            >
              <div
                className={`w-3 h-3 ${
                  i % 3 === 0
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                    : i % 3 === 1
                      ? "bg-gradient-to-r from-purple-400 to-pink-500 rotate-45"
                      : "bg-gradient-to-r from-emerald-400 to-teal-500 rounded-sm rotate-12"
                } opacity-40`}
              />
            </div>
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <Badge className="mb-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-8 py-3 text-sm font-medium shadow-lg shadow-cyan-500/25">
              <Sparkles className="mr-2 h-4 w-4" />
              Registration Open for Olympiad 3.0
            </Badge>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-slate-800 via-cyan-600 to-purple-600 dark:from-white dark:via-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">
                MATH & SCIENCE
              </span>
              <span className="block bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
                OLYMPIAD 3.0
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Embark on a journey of scientific discovery and mathematical excellence.
              <br />
              <span className="font-semibold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                Where brilliant minds converge to shape the future.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              {/* Sahara Animated Button */}
              <button
                type="button"
                className="sahara-animated-btn px-10 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-xl group-hover:shadow-2xl group-hover:shadow-red-600 shadow-red-600 uppercase font-serif tracking-widest relative overflow-hidden group text-transparent cursor-pointer z-10 after:absolute after:rounded-full after:bg-red-200 after:h-[85%] after:w-[95%] after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 hover:saturate-[1.15] active:saturate-[1.4]"
                style={{ WebkitBoxReflect: 'below 0px linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.4))' }}
              >
                Button
                <p
                  className="sahara-text-1 absolute z-40 font-semibold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent top-1/2 left-1/2 -translate-x-1/2 group-hover:-translate-y-full h-full w-full transition-all duration-300 -translate-y-[30%] tracking-widest"
                >
                  WELCOME
                </p>
                <p
                  className="sahara-text-2 absolute z-40 top-1/2 left-1/2 bg-gradient-to-r from-red-700 to-orange-700 bg-clip-text text-transparent -translate-x-1/2 translate-y-full h-full w-full transition-all duration-300 group-hover:-translate-y-[40%] tracking-widest font-extrabold"
                >
                  SAHARA
                </p>
                <svg
                  className="sahara-svg-1 absolute w-full h-full scale-x-125 rotate-180 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 group-hover:animate-none animate-pulse group-hover:-translate-y-[45%] transition-all duration-300"
                  viewBox="0 0 2400 800"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="sssurf-grad" y2="100%" x2="50%" y1="0%" x1="50%">
                      <stop offset="0%" stopOpacity="1" stopColor="hsl(37, 99%, 67%)" />
                      <stop offset="100%" stopOpacity="1" stopColor="hsl(316, 73%, 52%)" />
                    </linearGradient>
                  </defs>
                  <g transform="matrix(1,0,0,1,0,-91.0877685546875)" fill="url(#sssurf-grad)">
                    <path opacity="0.05" transform="matrix(1,0,0,1,0,35)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                    <path opacity="0.21" transform="matrix(1,0,0,1,0,70)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                    <path opacity="0.37" transform="matrix(1,0,0,1,0,105)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                    <path opacity="0.53" transform="matrix(1,0,0,1,0,140)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                    <path opacity="0.68" transform="matrix(1,0,0,1,0,175)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                    <path opacity="0.84" transform="matrix(1,0,0,1,0,210)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                    <path opacity="1" transform="matrix(1,0,0,1,0,245)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                  </g>
                </svg>
                <svg
                  className="sahara-svg-2 absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-[30%] group-hover:-translate-y-[33%] group-hover:scale-95 transition-all duration-500 z-40 fill-red-500"
                  viewBox="0 0 1440 320"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0,288L9.2,250.7C18.5,213,37,139,55,133.3C73.8,128,92,192,111,224C129.2,256,148,256,166,256C184.6,256,203,256,222,250.7C240,245,258,235,277,213.3C295.4,192,314,160,332,170.7C350.8,181,369,235,388,229.3C406.2,224,425,160,443,122.7C461.5,85,480,75,498,74.7C516.9,75,535,85,554,101.3C572.3,117,591,139,609,170.7C627.7,203,646,245,665,256C683.1,267,702,245,720,245.3C738.5,245,757,267,775,266.7C793.8,267,812,245,831,234.7C849.2,224,868,224,886,218.7C904.6,213,923,203,942,170.7C960,139,978,85,997,53.3C1015.4,21,1034,11,1052,48C1070.8,85,1089,171,1108,197.3C1126.2,224,1145,192,1163,197.3C1181.5,203,1200,245,1218,224C1236.9,203,1255,117,1274,106.7C1292.3,96,1311,160,1329,170.7C1347.7,181,1366,139,1385,128C1403.1,117,1422,139,1431,149.3L1440,160L1440,320L1430.8,320C1421.5,320,1403,320,1385,320C1366.2,320,1348,320,1329,320C1310.8,320,1292,320,1274,320C1255.4,320,1237,320,1218,320C1200,320,1182,320,1163,320C1144.6,320,1126,320,1108,320C1089.2,320,1071,320,1052,320C1033.8,320,1015,320,997,320C978.5,320,960,320,942,320C923.1,320,905,320,886,320C867.7,320,849,320,831,320C812.3,320,794,320,775,320C756.9,320,738,320,720,320C701.5,320,683,320,665,320C646.2,320,628,320,609,320C590.8,320,572,320,554,320C535.4,320,517,320,498,320C480,320,462,320,443,320C424.6,320,406,320,388,320C369.2,320,351,320,332,320C313.8,320,295,320,277,320C258.5,320,240,320,222,320C203.1,320,185,320,166,320C147.7,320,129,320,111,320C92.3,320,74,320,55,320C36.9,320,18,320,9,320L0,320Z"
                    fillOpacity="1"
                  />
                </svg>
              </button>
              {/* End Sahara Animated Button */}

              {/* Existing Buttons */}
              <Button
                    asChild
                    className="group relative h-12 w-48 overflow-hidden rounded-xl border-0 px-6 py-2 font-bold shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-red-600/40"
                    style={{ 
                      background: 'linear-gradient(to right, #ef4444, #f97316)',
                      WebkitBoxReflect: 'below 0px linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.2))'
                    }}
                  >
                    <Link 
                      href="/register" 
                      className="relative z-10 flex h-full w-full items-center justify-center text-white"
                    >
                      <div className="flex items-center text-sm">
                        <Rocket className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                        Launch Now
                      </div>
                      
                      {/* Flame effect */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -bottom-5 -left-5 -right-5 top-0 animate-flame bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuMDUiIG51bU9jdGF2ZXM9IjUiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48L3N2Zz4=')] opacity-30 mix-blend-screen"></div>
                      </div>
                    </Link>
                  </Button>


              {admitCardEnabled && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group border-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 px-10 py-6 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                >
                  <Link href="/admit-card">
                    <Award className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                    Download Admit Card
                  </Link>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Users, label: "Participants", value: "10,000+", color: "from-blue-500 to-cyan-500" },
                { icon: Trophy, label: "Prize Pool", value: "₹5 Lakh+", color: "from-yellow-500 to-orange-500" },
                { icon: BookOpen, label: "Subjects", value: "3", color: "from-green-500 to-emerald-500" },
                { icon: Star, label: "Edition", value: "3rd", color: "from-purple-500 to-pink-500" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20 dark:border-slate-700/20 hover:border-cyan-400/50"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div
                    className={`bg-gradient-to-r ${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300`}
                  >
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-black text-slate-800 dark:text-white mb-2">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => scrollToSection("about")}
              className="group text-cyan-500 hover:text-purple-500 transition-all duration-300 animate-bounce-slow"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium">Explore More</span>
                <ChevronDown className="h-8 w-8 group-hover:scale-125 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section
        id="gallery"
        className="py-32 bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-800 dark:to-purple-900 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-30 dark:opacity-50"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='none'%20fillRule='evenodd'%3E%3Cg%20fill='%236366f1'%20fillOpacity='0.05'%3E%3Ccircle%20cx='30'%20cy='30'%20r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-slate-800 to-purple-600 dark:from-white dark:to-purple-400 bg-clip-text text-transparent">
              Olympiad 2.0 Memories
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Witness the moments that defined excellence, innovation, and the spirit of scientific discovery.
            </p>
          </div>

          {/* Featured Photo Carousel */}
          <div className="relative mb-16 max-w-6xl mx-auto">
            <div className="relative h-96 md:h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
              <GoogleDriveImage
                photo={OLYMPIAD_PHOTOS[currentPhotoIndex]}
                alt={OLYMPIAD_PHOTOS[currentPhotoIndex]?.title || "Olympiad Photo"}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105"
                priority
                useThumbnail={false}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute top-6 right-6 flex items-center gap-3">
                <button
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
                >
                  {isAutoPlay ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentPhotoIndex + 1} / {OLYMPIAD_PHOTOS.length}
                </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6">
                  <h3 className="text-3xl font-bold mb-3">{OLYMPIAD_PHOTOS[currentPhotoIndex]?.title}</h3>
                  <p className="text-lg opacity-90 mb-4">{OLYMPIAD_PHOTOS[currentPhotoIndex]?.description}</p>
                  <Badge className="bg-cyan-500/80 text-white">{OLYMPIAD_PHOTOS[currentPhotoIndex]?.category}</Badge>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 gap-3 flex-wrap">
              {OLYMPIAD_PHOTOS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentPhotoIndex
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 scale-125 shadow-lg"
                      : "bg-slate-300 dark:bg-slate-600 hover:bg-cyan-300 dark:hover:bg-cyan-500"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {OLYMPIAD_PHOTOS.map((photo, index) => (
              <div key={photo.id} className="group relative cursor-pointer" onClick={() => setCurrentPhotoIndex(index)}>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <GoogleDriveImage
                    photo={photo}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    useThumbnail={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-semibold truncate">{photo.title}</p>
                    <Badge className="mt-1 bg-cyan-500/80 text-xs">{photo.category}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section id="details" className="py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-slate-800 to-emerald-600 dark:from-white dark:to-emerald-400 bg-clip-text text-transparent">
              Event Details
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto">
              Everything you need to know about participating in Math & Science Olympiad 3.0
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              {[
                {
                  icon: Calendar,
                  title: "Exam Date",
                  content: "July 26, 2025 (Saturday)",
                  subtitle: "Registration deadline: July 20, 2025",
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  icon: MapPin,
                  title: "Venue",
                  content: "Multiple centers across Bangladesh",
                  subtitle: "Exact venue will be mentioned in admit card",
                  gradient: "from-emerald-500 to-teal-500",
                },
                {
                  icon: BookOpen,
                  title: "Subjects",
                  content: "Mathematics, Science & Physics",
                  subtitle: "For classes 5-10 across different categories",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: Trophy,
                  title: "Registration Fee",
                  content: "Only ৳150 per participant",
                  subtitle: "Payment via bKash: +880 1518-405600",
                  gradient: "from-yellow-500 to-orange-500",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-6 group">
                  <div
                    className={`bg-gradient-to-r ${item.gradient} w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}
                  >
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-lg text-slate-700 dark:text-slate-300 mb-1">{item.content}</p>
                    <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-3xl p-10 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Sparkles className="h-8 w-8" />
                    Why Participate?
                  </h3>
                  <ul className="space-y-6">
                    {[
                      { icon: Brain, text: "Compete with the brightest minds" },
                      { icon: Trophy, text: "Win exciting prizes and certificates" },
                      { icon: Rocket, text: "Boost your academic profile" },
                      { icon: Users, text: "Network with like-minded students" },
                      { icon: Star, text: "Get recognition from top institutions" },
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-center gap-4">
                        <benefit.icon className="h-6 w-6 text-yellow-300" />
                        <span className="text-lg">{benefit.text}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className="w-full mt-8 bg-white text-purple-600 hover:bg-gray-100 font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Link href="/register">
                      <Zap className="mr-3 h-5 w-5" />
                      Start Your Journey
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-32 bg-gradient-to-br from-slate-100 to-purple-100 dark:from-slate-800 dark:to-purple-900"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-slate-800 to-purple-600 dark:from-white dark:to-purple-400 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto">
              Have questions? We're here to help you succeed in your olympiad journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Abu Bakkar Siddique",
                role: "Founder & Organizer",
                description: "For registration queries and general information",
                phone: "+880 1518-405600",
                email: "contact@savarscience.org",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                name: "Hujaifa Khan",
                role: "Co-Organizer",
                description: "For technical support and payment assistance",
                phone: "+880 1730-903744",
                email: "support@savarscience.org",
                gradient: "from-purple-500 to-pink-500",
              },
            ].map((contact, index) => (
              <Card
                key={index}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-3xl overflow-hidden"
              >
                <CardContent className="p-10 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 dark:to-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-6 mb-6">
                      <div
                        className={`bg-gradient-to-r ${contact.gradient} w-16 h-16 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300`}
                      >
                        <Phone className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{contact.name}</h3>
                        <p className="text-cyan-600 dark:text-cyan-400 font-semibold">{contact.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{contact.description}</p>
                    <div className="space-y-3">
                      <p className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                        <Phone className="h-5 w-5 text-cyan-500" />
                        <span className="font-medium">{contact.phone}</span>
                      </p>
                      <p className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                        <Mail className="h-5 w-5 text-cyan-500" />
                        <span className="font-medium">{contact.email}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Social Media */}
          <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">Follow Our Journey</h3>
            <div className="flex justify-center gap-8">
              <Link
                href={SOCIAL_LINKS.FACEBOOK}
                className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
              >
                <svg
                  className="h-8 w-8 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link
                href={SOCIAL_LINKS.YOUTUBE}
                className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
              >
                <svg
                  className="h-8 w-8 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-lg opacity-50"></div>
                  <Image
                    src={IMAGES.LOGO || "/placeholder.svg"}
                    alt="Savar Science Society Logo"
                    width={60}
                    height={60}
                    className="rounded-full relative z-10"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Savar Science Society
                  </h3>
                  <p className="text-slate-300">Inspiring Future Scientists</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed max-w-md">
                Empowering young minds through mathematics and science competitions, fostering innovation and excellence
                in education for a brighter tomorrow.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6 text-cyan-400">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/register"
                    className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Register Now
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Contact Us
                  </Link>
                </li>
                {admitCardEnabled && (
                  <li>
                    <Link
                      href="/admit-card"
                      className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Admit Card
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6 text-purple-400">Contact Info</h4>
              <div className="space-y-3 text-slate-300">
                <p className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-cyan-400" />
                  +880 1518-405600
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-cyan-400" />
                  +880 1730-903744
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-cyan-400" />
                  contact@savarscience.org
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-12 pt-8 text-center">
            <p className="text-slate-400">
              © 2025 Savar Science Society. All rights reserved. |
              <span className="ml-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                Designed with ❤️ for future scientists
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
