'use client';

import { useState } from 'react';
import { useParams, useRouter } from "next/navigation";
import { Star, Users, BookOpen, Play, Headphones, Clock, Award, Zap, Heart, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { useGetCourseQuery } from '@/lib/redux/features/course/courseApi';
import { useAppSelector } from '@/lib/redux/hooks';
import { useGetWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation, useEnrollCourseMutation, useCreateOrderMutation, useValidateCouponMutation, useVerifyPaymentMutation, type CouponPricingInfo } from '@/lib/redux/features/student/studentApi';
import { useGetCurrentUserQuery } from '@/lib/redux/features/auth/authApi';
import { toast } from 'sonner';
import { PropagateLoader } from 'react-spinners';
import { CourseShareDialog } from '@/components/shared/course-share-dialog';
import { Input } from '@/components/ui/input';

export default function CourseDetail() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('about');

  const params = useParams() as { id?: string };
  const courseId = params?.id;

  const authUser = useAppSelector((state) => state.auth.user);
  const { data: currentUser } = useGetCurrentUserQuery(undefined, {
    skip: !authUser,
  });
  const user = currentUser ?? authUser;
  const { data: wishlist } = useGetWishlistQuery(undefined, { skip: !user });
  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();
  const [enrollCourse] = useEnrollCourseMutation();
  const [createOrder] = useCreateOrderMutation();
  const [validateCoupon, { isLoading: isCouponValidating }] = useValidateCouponMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponPricingInfo | null>(null);

  const { data: course, isLoading, isError } = useGetCourseQuery(courseId ?? "");

  const isWishlisted =
    wishlist?.some((wishlistedCourse) => String(wishlistedCourse._id) === String(courseId)) ??
    false;
  const isToggling = isAdding || isRemoving;

  const price = Number(course?.price ?? 0);
  const offerPrice = Number(course?.offerPrice ?? 0);
  const baseCheckoutAmount = Number(course?.offerPrice ?? course?.price ?? 0);
  const payableAmount = Math.max(0, Number(appliedCoupon?.finalAmount ?? baseCheckoutAmount));

  const discountPercentage =
    price > 0 ? Math.round(((price - offerPrice) / price) * 100) : 0;
  const isPurchased = Boolean(
    user?.purchasedCourses?.some((p) =>
      typeof p === "string" ? p === courseId : p.courseId === courseId
    ),
  );

  const handleApplyCoupon = async () => {
    if (!courseId) return;

    const normalizedCode = couponCodeInput.trim().toUpperCase();
    if (!normalizedCode) {
      toast.error('Please enter a coupon code');
      return;
    }

    if (baseCheckoutAmount <= 0) {
      toast.error('Coupon is not applicable on free courses');
      return;
    }

    try {
      const response = await validateCoupon({
        courseId,
        couponCode: normalizedCode,
      }).unwrap();

      setAppliedCoupon(response.data);
      setCouponCodeInput(response.data.couponCode ?? normalizedCode);
      toast.success('Coupon applied successfully');
    } catch (error: any) {
      setAppliedCoupon(null);
      toast.error(error?.data?.message || 'Failed to apply coupon');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
  };

  const handleEnrollNow = async () => {
    if (!user) {
      toast.error("Please login to enroll this course.");
      router.push("/login");
      return;
    }

    if (!courseId) return;

    if (isPurchased) {
      router.push(`/play?courseId=${courseId}`);
      return;
    }

    const finalPayableAmount = Math.max(0, Number(appliedCoupon?.finalAmount ?? course?.offerPrice ?? course?.price ?? 0));

    // Free course: enroll directly
    if (finalPayableAmount === 0) {
      try {
        setIsEnrolling(true);
        await enrollCourse({ courseId }).unwrap();
        toast.success("Course enrolled successfully.");
        router.push(`/play?courseId=${courseId}`);
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to enroll course.");
      } finally {
        setIsEnrolling(false);
      }
      return;
    }

    // Paid course: Razorpay checkout
    try {
      setIsEnrolling(true);
      const orderRes = await createOrder({
        courseId,
        couponCode: appliedCoupon?.couponCode ?? undefined,
      }).unwrap();
      const { orderId, amount, currency, keyId } = orderRes.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Ash Academy",
        description: course?.title ?? "Course Enrollment",
        order_id: orderId,
        handler: async (response: any) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();
            toast.success("Payment successful! Course enrolled.");
            router.push(`/play?courseId=${courseId}`);
          } catch {
            toast.error("Payment verification failed. Contact support.");
          } finally {
            setIsEnrolling(false);
          }
        },
        prefill: {
          name: user?.name ?? "",
          email: user?.email ?? "",
        },
        theme: { color: "#7E23FE" },
        modal: {
          ondismiss: () => {
            setIsEnrolling(false);
            toast.error("Payment cancelled.");
          },
        },
      };

      const Razorpay = (window as any).Razorpay;
      if (!Razorpay) {
        toast.error("Razorpay SDK not loaded. Please refresh the page.");
        setIsEnrolling(false);
        return;
      }
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to initiate payment.");
      setIsEnrolling(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please login to manage your wishlist.");
      router.push("/login");
      return;
    }

    if (!courseId) return;

    try {
      if (isWishlisted) {
        await removeFromWishlist({ courseId }).unwrap();
        toast.success("Removed from wishlist!");
      } else {
        await addToWishlist({ courseId }).unwrap();
        toast.success("Added to wishlist!");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update wishlist.");
    }
  };

  const averageRating = course?.rating?.length
    ? course.rating.reduce((sum, item) => sum + item.rating, 0) /
      course.rating.length
    : 0;

    const formattedRating = averageRating.toFixed(1);

    const [showAllReviews, setShowAllReviews] = useState(false);

    const visibleReviews = showAllReviews
      ? (course?.rating ?? [])
      : (course?.rating ?? []).slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <PropagateLoader color="#7E23FE" loading={true} size={15} />
      </div>
    );
  }

  if(isError){
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p className="text-red-500 text-lg">Failed to fetch course details</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Back Button */}
      <div className="max-w-fill mx-auto px-4 sm:px-6 lg:px-15 py-4 sm:py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium text-sm"
        >
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
                {course?.category}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {course?.title}
              </h1>

              {/* Rating & Enrollment */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-900">
                    {formattedRating}
                  </span>
                  <span className="text-gray-600">
                    ({course?.rating?.length} Ratings)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={18} />
                  <span>{course?.enrolledStudents.length} Enrolled</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-400 to-pink-600 shrink-0" />
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">
                    Instructor
                  </p>
                  <p className="font-semibold text-gray-900">
                    {course?.instructor}
                  </p>
                  <p className="text-sm text-gray-600">
                    {course?.instructorTitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex gap-8 sm:gap-12 overflow-x-auto">
                {["about", "lessons", "trial", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab === "about"
                      ? "About"
                      : tab === "lessons"
                        ? "Lessons"
                        : tab === "trial"
                          ? "Free Trial"
                          : "Reviews"}
                  </button>
                ))}
              </div>
            </div>

            {/* About Content */}
            {activeTab === "about" && (
              <div className="space-y-8">
                {/* Main Description */}
                <div>
                  {/* <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    {course?.title}
                  </h2> */}
                  <div
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: course?.description || "",
                    }}
                  />
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-primary transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                        <Zap size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Vector Precision
                        </h3>
                        <p className="text-sm text-gray-600">
                          Learn the mathematics of curves and anchor points to
                          create pixel-perfect art.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 hover:border-primary transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                        <Star size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Color Theory
                        </h3>
                        <p className="text-sm text-gray-600">
                          Master Pantone matching and digital color profiles for
                          global brand consistency.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Features */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                    Course Features
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { icon: Clock, label: "Lifetime Access", desc: "" },
                      { icon: Play, label: "3 Video Lectures", desc: "" },
                      { icon: BookOpen, label: "1 Free Video", desc: "" },
                      { icon: Award, label: "Certificate Available", desc: "" },
                      { icon: Headphones, label: "24/7 Support", desc: "" },
                      { icon: Zap, label: "Updated Weekly", desc: "" },
                    ].map((feature, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-lg p-6 text-center hover:border-primary hover:bg-violet-50 transition-colors"
                      >
                        <feature.icon
                          size={32}
                          className="text-primary mx-auto mb-3"
                        />
                        <p className="font-semibold text-gray-900">
                          {feature.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {activeTab === "lessons" && (
              <div className="space-y-4">
                {course?.chapters?.length ? (
                  course.chapters.map((chapter, index: number) => (
                    <div
                      key={chapter?._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary hover:bg-violet-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="text-primary" size={20} />
                        <h3 className="text-lg font-medium text-gray-900">
                          Chapter {index + 1}: {chapter?.title}
                        </h3>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No chapters available.
                  </div>
                )}
              </div>
            )}

            {activeTab === "trial" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Free Trial</h2>

                {course?.videoUrl ? (
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <video
                      key={course?.videoUrl}
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${course?.videoUrl}`}
                      controls
                      className="h-full w-full"
                    />

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {course.title}
                      </h3>
                      {/* <p className="text-sm text-gray-600 mt-1">
                        Watch this free preview before enrolling.
                      </p> */}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No trial video available.
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                {course?.rating?.length ? (
                  visibleReviews.map((review, index: number) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {review.userName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className="fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>

                      <p className="mt-3 text-gray-700">{review.review}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No reviews yet.
                  </div>
                )}
              </div>
            )}
            {course?.rating && course.rating.length > 5 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="text-primary font-medium hover:underline"
                >
                  {showAllReviews ? "See Less" : "See More"}
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Pricing */}
              <div
                id="purchase"
                className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4 scroll-mt-24"
              >
                <div>
                  <p className="text-gray-600 text-sm mb-1">Price</p>
                  {course?.offerPrice ? (
                    <div className="flex items-end gap-3">
                      <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                        ₹{course?.offerPrice}
                      </span>
                      <span className="line-through text-gray-500">
                        ₹{course?.price}
                      </span>
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                        {discountPercentage}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                      ₹{course?.price}
                    </span>
                  )}
                </div>

                <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Apply Coupon</p>
                  <div className="flex gap-2">
                    <Input
                      value={couponCodeInput}
                      onChange={(event) => {
                        setCouponCodeInput(event.target.value.toUpperCase());
                        if (appliedCoupon && event.target.value.toUpperCase() !== (appliedCoupon.couponCode ?? '')) {
                          setAppliedCoupon(null);
                        }
                      }}
                      placeholder="Enter coupon code"
                      className="h-10 bg-white"
                      disabled={isEnrolling || isCouponValidating || isPurchased || baseCheckoutAmount <= 0}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isEnrolling || isCouponValidating || isPurchased || baseCheckoutAmount <= 0}
                      className="rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isCouponValidating ? 'Applying...' : 'Apply'}
                    </button>
                  </div>

                  {appliedCoupon ? (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
                      <p className="text-xs font-semibold text-emerald-700">
                        Coupon {appliedCoupon.couponCode} applied
                      </p>
                      <p className="mt-1 text-xs text-emerald-700">
                        You saved ₹{appliedCoupon.discountAmount.toFixed(2)}
                      </p>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="mt-2 text-xs font-semibold text-emerald-700 underline underline-offset-2"
                      >
                        Remove coupon
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm space-y-2">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Base Price</span>
                    <span>₹{baseCheckoutAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>Coupon Discount</span>
                    <span>-₹{Number(appliedCoupon?.discountAmount ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
                    <span>Payable Amount</span>
                    <span>₹{payableAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Enroll Button */}
                <button
                  onClick={handleEnrollNow}
                  disabled={isEnrolling}
                  className="w-full bg-primary hover:bg-violet-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Play size={18} />
                  {isEnrolling
                    ? "Enrolling..."
                    : isPurchased
                      ? "Play Course"
                      : "Enroll Now"}
                </button>

                {/* Wishlist */}
                <button
                  onClick={handleWishlistToggle}
                  disabled={isToggling}
                  className={`w-full border-2 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    isWishlisted
                      ? "border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300"
                      : "border-gray-200 text-gray-700 hover:border-primary hover:text-primary hover:bg-violet-50"
                  }`}
                >
                  <Heart
                    size={18}
                    className={isWishlisted ? "fill-red-500 text-red-500" : ""}
                  />
                  {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>

                {/* What's Included */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    What&apos;s Included
                  </p>
                  {[
                    "Lifetime Course Access",
                    "15+ Downloadable Resources",
                    "Personal Q&A with Instructor",
                    "Completion Certificate",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                        <span className="text-primary text-xs">✓</span>
                      </div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Social Share */}
              <CourseShareDialog
                courseId={courseId}
                courseTitle={course?.title}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
