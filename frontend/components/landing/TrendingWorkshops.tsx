"use client";

import React from "react";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";

interface Workshop {
  id: number;
  title: string;
  category: string;
  rating: number;
  instructorName: string;
  instructorImage: string;
  price: string;
  imageUrl: string;
  badge?: string;
  badgeColor?: string;
}

const workshops: Workshop[] = [
  {
    id: 1,
    title: "Mastering 2D Character Design for Games",
    category: "Illustration",
    rating: 4.9,
    instructorName: "Alex Rivera",
    instructorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
    price: "$49.99",
    imageUrl: "/illustration_course.png",
    badge: "Best Seller",
    badgeColor: "bg-indigo-950 text-white",
  },
  {
    id: 2,
    title: "Designing Emotional Interfaces",
    category: "UI/UX Design",
    rating: 4.8,
    instructorName: "Sarah Chen",
    instructorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    price: "$59.00",
    imageUrl: "/ui_ux_course.png",
    badge: "Intermediate",
    badgeColor: "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-600/10",
  },
  {
    id: 3,
    title: "Motion Basics: From Static to Alive",
    category: "Motion",
    rating: 5.0,
    instructorName: "Marcus Thorne",
    instructorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    price: "$35.00",
    imageUrl: "/motion_course.png",
  },
];

export default function TrendingWorkshops() {
  return (
    <section className="bg-purple-50/20 py-20">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-indigo-950">
            Trending Workshops
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Don't miss out on what everyone is learning.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {workshops.map((workshop) => (
            <div
              key={workshop.id}
              className="flex flex-col overflow-hidden rounded-3xl bg-white border border-purple-50 shadow-xs hover:shadow-md transition-shadow group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                <Image
                  src={workshop.imageUrl}
                  alt={workshop.title}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-300"
                />
                {workshop.badge && (
                  <span
                    className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${workshop.badgeColor}`}
                  >
                    {workshop.badge}
                  </span>
                )}
              </div>

              {/* Card Details */}
              <div className="flex flex-1 flex-col p-6">
                {/* Category & Rating */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-semibold text-primary uppercase tracking-wider">
                    {workshop.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                    <span className="font-bold text-gray-700">
                      {workshop.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="mt-4 flex-1 text-base font-bold text-indigo-950 line-clamp-2 group-hover:text-primary transition-colors">
                  {workshop.title}
                </h3>

                {/* Instructor Info */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-purple-100">
                    <Image
                      src={workshop.instructorImage}
                      alt={workshop.instructorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {workshop.instructorName}
                  </span>
                </div>

                {/* Footer / Price & Add to Cart */}
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-purple-50">
                  <span className="text-xl font-bold text-indigo-950">
                    {workshop.price}
                  </span>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-primary transition-colors hover:bg-purple-600 hover:text-white active:scale-95">
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
