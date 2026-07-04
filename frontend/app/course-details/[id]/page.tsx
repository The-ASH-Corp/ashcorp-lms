'use client';

import { use, useState } from 'react';
import { useRouter } from "next/navigation";
import { Star, Users, BookOpen, Play, Headphones, Clock, Award, Zap, Heart, Share2, ArrowLeft } from 'lucide-react';

export default function CourseDetail() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('about');
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-fill mx-auto px-4 sm:px-6 lg:px-15 py-4 sm:py-6">
        <button onClick={()=> router.back()} className="flex items-center gap-2 text-gray-600 hover:text-violet-600 transition-colors font-medium text-sm">
          <ArrowLeft size={18} />
          Back to Courses
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-fill mx-auto px-4 sm:px-6 lg:px-15 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold uppercase rounded-full mb-4">
                Graphic Designing
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Mastering Adobe Illustrator: From Basics to Advanced
              </h1>

              {/* Rating & Enrollment */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-900">5.0</span>
                  <span className="text-gray-600">(124 Ratings)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={18} />
                  <span>7,420 Enrolled</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-400 to-pink-600 shrink-0" />
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Instructor</p>
                  <p className="font-semibold text-gray-900">Hazeem</p>
                  <p className="text-sm text-gray-600">Senior Graphic Designer</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex gap-8 sm:gap-12 overflow-x-auto">
                {['about', 'lessons', 'trial', 'reviews'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? 'text-violet-600 border-b-2 border-violet-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab === 'about' ? 'About' : tab === 'lessons' ? 'Lessons' : tab === 'trial' ? 'Free Trial' : 'Reviews'}
                  </button>
                ))}
              </div>
            </div>

            {/* About Content */}
            {activeTab === 'about' && (
              <div className="space-y-8">
                {/* Main Description */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Master the Vector Universe</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Mastering Adobe Illustrator is the art of creating high-quality vector designs that communicate ideas with precision and creativity. It combines advanced tools, techniques, and professional workflows to design logos, branding materials, illustrations, and digital graphics.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    With expert use of typography, colors, and scalable visuals, this course helps designers produce impactful, industry-level designs with confidence. You&apos;ll dive deep into the Penn tool, Shape Builder, Gradient Meshes, and the new AI-powered generative features that are revolutionizing the industry.
                  </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-violet-600 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                        <Zap size={24} className="text-violet-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Vector Precision</h3>
                        <p className="text-sm text-gray-600">Learn the mathematics of curves and anchor points to create pixel-perfect art.</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 hover:border-violet-600 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                        <Star size={24} className="text-violet-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Color Theory</h3>
                        <p className="text-sm text-gray-600">Master Pantone matching and digital color profiles for global brand consistency.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Features */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Course Features</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { icon: Clock, label: 'Lifetime Access', desc: '' },
                      { icon: Play, label: '3 Video Lectures', desc: '' },
                      { icon: BookOpen, label: '1 Free Video', desc: '' },
                      { icon: Award, label: 'Certificate Available', desc: '' },
                      { icon: Headphones, label: '24/7 Support', desc: '' },
                      { icon: Zap, label: 'Updated Weekly', desc: '' }
                    ].map((feature, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-6 text-center hover:border-violet-600 hover:bg-violet-50 transition-colors">
                        <feature.icon size={32} className="text-violet-600 mx-auto mb-3" />
                        <p className="font-semibold text-gray-900">{feature.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {activeTab !== 'about' && (
              <div className="py-12 text-center text-gray-600">
                <p>{activeTab === 'lessons' ? 'Lessons' : activeTab === 'trial' ? 'Free Trial' : 'Reviews'} content coming soon</p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Course Card */}
              <div className="bg-linear-to-br from-gray-900 to-violet-900 rounded-xl overflow-hidden shadow-lg">
                <div className="aspect-video bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent to-white/20" />
                  </div>
                  <div className="relative z-10 text-center">
                    <p className="text-white text-xs font-semibold mb-2">PREMIUM COURSE</p>
                    <p className="text-white text-2xl sm:text-3xl font-bold">LEARN</p>
                    <p className="text-white text-xl sm:text-2xl font-bold">ILLUSTRATOR</p>
                  </div>
                  <div className="absolute top-4 right-4 w-12 h-12 bg-violet-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Ai</span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Price</p>
                  <div className="flex items-end gap-3">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">$199.99</span>
                    <span className="line-through text-gray-500">$499.00</span>
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">60% OFF</span>
                  </div>
                </div>

                {/* Enroll Button */}
                <button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Play size={18} />
                  Enroll Now
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="w-full border-2 border-gray-200 text-gray-700 hover:border-violet-600 hover:text-violet-600 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
                  Add to Wishlist
                </button>

                {/* What's Included */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase">What&apos;s Included</p>
                  {[
                    'Lifetime Course Access',
                    '15+ Downloadable Resources',
                    'Personal Q&A with Instructor',
                    'Completion Certificate'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                        <span className="text-violet-600 text-xs">✓</span>
                      </div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Promo Code */}
                <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 text-center">
                  <p className="text-xs text-violet-700">
                    Use code <span className="font-bold">ZENITH20</span> for extra 20% off!
                  </p>
                </div>
              </div>

              {/* Social Share */}
              <button className="w-full border border-gray-300 text-gray-700 hover:border-violet-600 hover:text-violet-600 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Share2 size={18} />
                Share Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
