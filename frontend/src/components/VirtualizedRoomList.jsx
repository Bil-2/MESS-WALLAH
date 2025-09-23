// MESS WALLAH - Rocket-Fast Virtualized Room List
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useVirtualScroll, useIntersectionObserver } from '../hooks/usePerformance';
import RocketRoomCard from './RocketRoomCard';

const ITEM_HEIGHT = 400; // Approximate height of each room card
const CONTAINER_HEIGHT = 800; // Height of the scrollable container

const VirtualizedRoomList = memo(({
  rooms = [],
  onBookNow,
  onViewDetails,
  onToggleFavorite,
  isLoading = false,
  hasMore = false,
  onLoadMore
}) => {
  const [containerRef, setContainerRef] = useState(null);
  const { elementRef, isVisible } = useIntersectionObserver();

  // Use virtual scrolling for performance
  const { visibleItems, totalHeight, handleScroll } = useVirtualScroll(
    rooms,
    ITEM_HEIGHT,
    CONTAINER_HEIGHT
  );

  // Memoized grid calculation
  const gridConfig = useMemo(() => {
    const columns = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    const itemsPerRow = columns;
    const rowHeight = ITEM_HEIGHT + 32; // Include gap
    
    return { columns, itemsPerRow, rowHeight };
  }, []);

  // Load more when scrolling near bottom
  const handleScrollWithLoadMore = useCallback((e) => {
    handleScroll(e);
    
    if (hasMore && onLoadMore) {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      if (scrollPercentage > 0.8) {
        onLoadMore();
      }
    }
  }, [handleScroll, hasMore, onLoadMore]);

  // Optimized event handlers
  const optimizedHandlers = useMemo(() => ({
    onBookNow: onBookNow ? (roomId) => onBookNow(roomId) : undefined,
    onViewDetails: onViewDetails ? (roomId) => onViewDetails(roomId) : undefined,
    onToggleFavorite: onToggleFavorite ? (roomId) => onToggleFavorite(roomId) : undefined,
  }), [onBookNow, onViewDetails, onToggleFavorite]);

  if (isLoading && rooms.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(9)].map((_, index) => (
          <div key={index} className="rocket-shimmer h-96 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No rooms found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search criteria or filters
        </p>
      </div>
    );
  }

  // For small lists, use regular grid
  if (rooms.length <= 12) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room, index) => (
          <div key={room.id || room._id} className="rocket-fade-in">
            <RocketRoomCard
              room={room}
              onBookNow={optimizedHandlers.onBookNow}
              onViewDetails={optimizedHandlers.onViewDetails}
              onToggleFavorite={optimizedHandlers.onToggleFavorite}
              priority={index < 6}
            />
          </div>
        ))}
      </div>
    );
  }

  // For large lists, use virtualization
  return (
    <div className="relative">
      <div
        ref={elementRef}
        className="overflow-auto rocket-auto-visibility"
        style={{ height: CONTAINER_HEIGHT }}
        onScroll={handleScrollWithLoadMore}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleItems.map((room) => (
            <div
              key={room.id || room._id}
              className="absolute w-full"
              style={{
                top: room.top,
                height: ITEM_HEIGHT,
                transform: 'translate3d(0, 0, 0)' // GPU acceleration
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                <RocketRoomCard
                  room={room}
                  onBookNow={optimizedHandlers.onBookNow}
                  onViewDetails={optimizedHandlers.onViewDetails}
                  onToggleFavorite={optimizedHandlers.onToggleFavorite}
                  priority={room.index < 6}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Loading indicator for infinite scroll */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="rocket-pulse">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Scroll indicator */}
      {isVisible && rooms.length > 12 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          Showing {visibleItems.length} of {rooms.length}
        </div>
      )}
    </div>
  );
});

VirtualizedRoomList.displayName = 'VirtualizedRoomList';

export default VirtualizedRoomList;
