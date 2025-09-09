import { ArrowRight, Sparkles, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/public/etrant.png";
import Link from "next/link";
import WaitlistForm from "../waitlist";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      <div className="absolute top-32 right-20 text-orange-300/60">
        <Sparkles size={60} />
      </div>
      <div className="absolute bottom-40 left-16 text-emerald-300/60">
        <BookOpen size={50} />
      </div>
      <div className="relative z-10 container mx-auto px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-left">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
                  <Users className="md:w-4 md:h-4 w-3 h-3 text-emerald-300" />
                  <span className="text-white/90 md:text-sm text-xs font-medium">
                    Join 50+ Smart Learners
                  </span>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                Think{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Etrant
                </span>
              </h1>

              <div className="mb-8">
                <p className="md:text-4xl text-2xl font-bold text-orange-300 mb-4">
                  Scroll. Learn. Test. Repeat.
                </p>
                <p className="md:text-lg text-white/80 leading-relaxed max-w-lg">
                  Transform boring study sessions into addictive learning
                  experiences. Swipe through knowledge like Instagram reels and
                  ace your exams.
                </p>
              </div>

              <WaitlistForm />
              {/* <div className="flex flex-col sm:flex-row gap-4"> */}
              {/*   <Link href={"/auth"}> */}
              {/*     <Button */}
              {/*       size="lg" */}
              {/*       className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white md:font-bold px-6 py-2 md:px-8 md:py-4 md:text-lg rounded-full shadow-2xl transform transition-all" */}
              {/*     > */}
              {/*       Start Learning Free */}
              {/*       <ArrowRight className="ml-2 h-5 w-5" /> */}
              {/*     </Button> */}
              {/*   </Link> */}
              {/*   <Link href={"/how-it-works"}> */}
              {/*     <Button */}
              {/*       size="lg" */}
              {/*       variant="outline" */}
              {/*       className="border-2 border-white/30 bg-white text-black hover:text-white hover:bg-white/10 px-6 py-2 md:px-8 md:py-4 md:text-lg rounded-full backdrop-blur-sm" */}
              {/*     > */}
              {/*       See How It Works */}
              {/*     </Button> */}
              {/*   </Link> */}
              {/* </div> */}
            </div>

            {/* Right content - iPhone 16 Pro with dark theme website */}
            <div className="relative">
              <div className="relative mx-auto w-80 h-[650px] bg-gradient-to-b from-gray-900 to-black rounded-[3.5rem] p-2 shadow-2xl">
                {/* iPhone 16 Pro frame */}
                <div className="w-full h-full bg-black rounded-[3rem] overflow-hidden relative">
                  {/* Dynamic Island */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gray-950 rounded-full z-20"></div>

                  {/* Screen content */}
                  <div className="absolute inset-0 bg-gray-900 rounded-[3rem] overflow-hidden">
                    {/* Safari browser UI - Dark */}
                    <div className="bg-gray-800 px-4 pt-12 pb-2">
                      {/* Address bar */}
                      <div className="bg-gray-700 rounded-full px-4 py-2 shadow-sm border border-gray-600 mb-2">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <span className="font-medium">etrant.akkhil.dev</span>
                        </div>
                      </div>
                    </div>

                    {/* Website content - Dark theme */}
                    <div className="bg-gray-900 px-4 py-2 h-full overflow-hidden">
                      {/* Website header */}
                      <div className="flex items-center justify-between mb-4 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                            <Image
                              src={Logo}
                              className="w-full h-full"
                              alt="Etrant Logo"
                            />
                          </div>
                          <h3 className="text-lg font-bold text-white">
                            Etrant
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Sign Up
                          </button>
                        </div>
                      </div>

                      {/* Quiz interface - Dark theme */}
                      <div className="space-y-4">
                        {/* Question */}
                        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                          <h4 className="text-base font-semibold text-white leading-relaxed">
                            Which organelle is responsible for photosynthesis in
                            plant cells?
                          </h4>
                        </div>

                        {/* MCQ Options - Dark theme */}
                        <div className="space-y-2">
                          <button className="w-full bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-3 text-left transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center text-gray-400 text-sm font-bold">
                                A
                              </div>
                              <span className="text-gray-300 text-sm">
                                Mitochondria
                              </span>
                            </div>
                          </button>

                          <button className="w-full bg-blue-900/30 border-2 border-blue-500 rounded-lg p-3 text-left transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                B
                              </div>
                              <span className="text-white text-sm font-medium">
                                Chloroplast
                              </span>
                            </div>
                          </button>

                          <button className="w-full bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-3 text-left transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center text-gray-400 text-sm font-bold">
                                C
                              </div>
                              <span className="text-gray-300 text-sm">
                                Nucleus
                              </span>
                            </div>
                          </button>

                          <button className="w-full bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg p-3 text-left transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center text-gray-400 text-sm font-bold">
                                D
                              </div>
                              <span className="text-gray-300 text-sm">
                                Ribosome
                              </span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
