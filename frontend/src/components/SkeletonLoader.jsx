import React from 'react';

const SkeletonLoader = ({
  className = '',
  variant = 'text',
  width = '100%',
  height = '1rem',
  count = 1,
  animation = true
}) => {
  const baseClasses = `bg-gray-200 rounded ${animation ? 'animate-pulse' : ''}`;

  const variants = {
    text: 'h-4',
    title: 'h-6',
    subtitle: 'h-5',
    paragraph: 'h-4',
    button: 'h-10',
    avatar: 'rounded-full w-10 h-10',
    card: 'h-48',
    image: 'h-40',
    rectangle: ''
  };

  const skeletonClass = `${baseClasses} ${variants[variant]} ${className}`;
  const style = {
    width: typeof width === 'string' ? width : `${width}px`,
    height: variant === 'rectangle' ? (typeof height === 'string' ? height : `${height}px`) : undefined
  };

  if (count === 1) {
    return <div className={skeletonClass} style={style} />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={skeletonClass} style={style} />
      ))}
    </div>
  );
};

// Predefined skeleton components for common use cases
export const RoomCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <SkeletonLoader variant="image" className="w-full" />
    <div className="p-4 space-y-3">
      <SkeletonLoader variant="title" width="80%" />
      <SkeletonLoader variant="text" width="60%" />
      <div className="flex justify-between items-center">
        <SkeletonLoader variant="text" width="40%" />
        <SkeletonLoader variant="button" width="80px" height="32px" />
      </div>
    </div>
  </div>
);

export const BookingCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <SkeletonLoader variant="title" width="70%" />
        <SkeletonLoader variant="text" width="50%" />
      </div>
      <SkeletonLoader variant="rectangle" width="80px" height="24px" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <SkeletonLoader variant="text" width="90%" />
      <SkeletonLoader variant="text" width="80%" />
    </div>
    <div className="flex gap-2 pt-2">
      <SkeletonLoader variant="button" width="100px" height="36px" />
      <SkeletonLoader variant="button" width="80px" height="36px" />
    </div>
  </div>
);

export const RoomDetailsSkeleton = () => (
  <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
    {/* Image Gallery Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SkeletonLoader variant="image" className="w-full h-64 md:h-80" />
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonLoader key={i} variant="image" className="w-full h-20" />
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-3">
          <SkeletonLoader variant="title" width="80%" />
          <SkeletonLoader variant="text" width="60%" />
          <SkeletonLoader variant="paragraph" count={3} />
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <SkeletonLoader variant="subtitle" width="40%" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonLoader key={i} variant="text" width="80%" />
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <SkeletonLoader variant="title" width="60%" />
          <SkeletonLoader variant="text" width="40%" />
          <SkeletonLoader variant="button" className="w-full" />
        </div>
      </div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-6 space-y-3">
          <SkeletonLoader variant="text" width="60%" />
          <SkeletonLoader variant="title" width="40%" />
        </div>
      ))}
    </div>

    {/* Charts/Content */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <SkeletonLoader variant="subtitle" width="50%" className="mb-4" />
        <SkeletonLoader variant="rectangle" height="200px" />
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <SkeletonLoader variant="subtitle" width="50%" className="mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonLoader key={i} variant="text" width={`${90 - i * 10}%`} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonLoader;
