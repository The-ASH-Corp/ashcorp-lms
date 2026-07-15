"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Loader2,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/lib/redux/features/student/studentApi";
import { PropagateLoader } from "react-spinners";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getExcerpt(value: string, length = 120) {
  const plainText = stripHtml(value);

  if (!plainText) return "No description available.";
  if (plainText.length <= length) return plainText;

  return `${plainText.slice(0, length).trim()}...`;
}

function getImageUrl(imageUrl: string | undefined) {
  if (!imageUrl) return "";

  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/\/+$/, "") ?? "";
  const path = imageUrl.replace(/\\/g, "/").replace(/^\/+/, "");

  return baseUrl ? `${baseUrl}/${path}` : `/${path}`;
}

export default function Wishlist() {
  const user = useAppSelector((state) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [removingCourseId, setRemovingCourseId] = useState<string | null>(null);

  const {
    data: wishlist = [],
    isLoading,
    isError,
  } = useGetWishlistQuery(undefined, { skip: !user });
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const filteredWishlist = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return wishlist;

    return wishlist.filter((course) => {
      const searchableText = [
        course.title,
        course.instructor,
        course.category,
        stripHtml(course.description),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [searchQuery, wishlist]);

  const handleRemove = async (courseId?: string) => {
    if (!courseId) {
      toast.error("Missing course id.");
      return;
    }

    if (removingCourseId) return;

    try {
      setRemovingCourseId(courseId);
      await removeFromWishlist({ courseId }).unwrap();
      toast.success("Removed from wishlist.");
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to remove course from wishlist.",
      );
    } finally {
      setRemovingCourseId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-600 shadow-sm">
          <PropagateLoader color="#7E23FE" loading={true} size={15} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="text-lg font-semibold text-red-700">
            Failed to load wishlist
          </p>
          <p className="mt-2 text-sm leading-6 text-red-600">
            We could not fetch your saved courses right now. Please try again in
            a moment.
          </p>
        </div>
      </div>
    );
  }

  const totalSaved = wishlist.length;
  const shownCourses = filteredWishlist.length;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
            Saved courses
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Wishlist</h1>
          <p className="mt-2 text-sm text-gray-600">
            You have {totalSaved} saved course{totalSaved === 1 ? "" : "s"}.
          </p>
        </div>

        <div className="relative w-full lg:max-w-md">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search wishlist"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </section>

      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-gray-600">
          {shownCourses} of {totalSaved} course{totalSaved === 1 ? "" : "s"}{" "}
          shown
        </p>

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-sm font-medium text-primary hover:text-violet-700"
          >
            Clear search
          </button>
        )}
      </div>

      {filteredWishlist.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredWishlist.map((course) => {
            const courseId = course._id ?? "";
            const imageSrc = getImageUrl(course.imageUrl);
            const price = Number(course.price ?? 0);
            const offerPrice = Number(course.offerPrice ?? 0);
            const hasDiscount = offerPrice > 0 && offerPrice < price;
            const currentPrice = hasDiscount ? offerPrice : price;
            const discountPercentage = hasDiscount
              ? Math.round(((price - offerPrice) / price) * 100)
              : 0;
            const detailsHref = courseId
              ? `/course-details/${courseId}`
              : "/courses";

            return (
              <article
                key={courseId || `${course.title}-${course.instructor}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-violet-100 to-gray-200">
                      <BookOpen className="text-primary" size={40} />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/5 to-transparent" />

                  <span className="absolute left-4 top-4 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                    {course.category}
                  </span>

                  <ConfirmActionDialog
                    title="Remove From Wishlist"
                    description={`Remove ${course.title} from your wishlist?`}
                    confirmLabel="Remove"
                    loading={removingCourseId === courseId}
                    loadingLabel="Removing..."
                    onConfirm={() => handleRemove(courseId)}
                    trigger={
                      <button
                        type="button"
                        disabled={!courseId || removingCourseId === courseId}
                        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
                        aria-label="Remove from wishlist"
                      >
                        {removingCourseId === courseId ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    }
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h2 className="line-clamp-2 text-lg font-bold text-gray-900">
                    {course.title}
                  </h2>

                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <UserRound size={16} className="text-primary" />
                    {course.instructor}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                    {getExcerpt(course.description)}
                  </p>

                  <div className="mt-5 border-t border-gray-200 pt-4">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                          Price
                        </p>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-xl font-bold text-gray-900">
                            {formatCurrency(currentPrice)}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatCurrency(price)}
                            </span>
                          )}
                        </div>
                        {hasDiscount ? (
                          <p className="mt-1 text-xs font-medium text-green-600">
                            Save {discountPercentage}% now
                          </p>
                        ) : (
                          <p className="mt-1 text-xs text-gray-500">
                            No active discount
                          </p>
                        )}
                      </div>

                      <Link
                        href={detailsHref}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
                      >
                        View
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-primary">
            <BookOpen size={28} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            {totalSaved === 0
              ? "Your wishlist is empty"
              : "No matching courses"}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-600">
            {totalSaved === 0
              ? "Save courses here to keep them handy for later."
              : "Try a different search term or clear the filter to see everything you saved."}
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
          >
            Browse courses
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
