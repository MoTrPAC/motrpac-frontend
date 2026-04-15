import { useState, useMemo, useCallback, useRef, useEffect } from 'react';

/**
 * Advanced pagination hook with performance optimizations and enhanced features
 * @param {Array} data - The data to paginate
 * @param {Object} options - Configuration options
 * @returns {Object} Advanced pagination state and controls
 */
export const useAdvancedPagination = (data, options = {}) => {
  const {
    initialPageSize = 20,
    enableVirtualization = false,
    enableUrlSync = false,
    enableAnalytics = false,
    maxPagesToShow = 7,
    debounceDelay = 300,
  } = options;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialPageSize);
  const [isNavigating, setIsNavigating] = useState(false);
  const debounceTimer = useRef(null);

  // URL synchronization
  useEffect(() => {
    if (!enableUrlSync) return;

    const urlParams = new URLSearchParams(window.location.search);
    const urlPage = parseInt(urlParams.get('page')) || 1;
    const urlSize = parseInt(urlParams.get('size')) || initialPageSize;

    if (urlPage !== currentPage) setCurrentPage(urlPage);
    if (urlSize !== itemsPerPage) setItemsPerPage(urlSize);
  }, []);

  // Update URL when pagination changes
  useEffect(() => {
    if (!enableUrlSync) return;

    const url = new URL(window.location);
    url.searchParams.set('page', currentPage.toString());
    url.searchParams.set('size', itemsPerPage.toString());
    window.history.replaceState({}, '', url);
  }, [currentPage, itemsPerPage, enableUrlSync]);

  // Memoized calculations
  const paginationData = useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return {
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages,
    };
  }, [data.length, currentPage, itemsPerPage]);

  // Virtualized or regular data slicing
  const currentPageData = useMemo(() => {
    if (enableVirtualization && data.length > 1000) {
      // For very large datasets, consider implementing virtual scrolling
      return data.slice(paginationData.startIndex, paginationData.endIndex);
    }
    return data.slice(paginationData.startIndex, paginationData.endIndex);
  }, [data, paginationData.startIndex, paginationData.endIndex, enableVirtualization]);

  // Analytics tracking
  const trackNavigation = useCallback((action, page) => {
    if (!enableAnalytics) return;
    
    // Track pagination events
    if (window.gtag) {
      window.gtag('event', 'pagination_navigate', {
        action,
        page,
        total_pages: paginationData.totalPages,
        items_per_page: itemsPerPage,
      });
    }
  }, [paginationData.totalPages, itemsPerPage, enableAnalytics]);

  // Debounced navigation
  const debouncedNavigation = useCallback((action, page) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setIsNavigating(true);
    debounceTimer.current = setTimeout(() => {
      setCurrentPage(page);
      setIsNavigating(false);
      trackNavigation(action, page);
    }, debounceDelay);
  }, [debounceDelay, trackNavigation]);

  // Navigation functions with analytics
  const goToPage = useCallback((page) => {
    const validPage = Math.max(1, Math.min(page, paginationData.totalPages));
    if (validPage !== currentPage) {
      debouncedNavigation('go_to_page', validPage);
    }
  }, [currentPage, paginationData.totalPages, debouncedNavigation]);

  const goToNextPage = useCallback(() => {
    if (paginationData.hasNextPage) {
      debouncedNavigation('next_page', currentPage + 1);
    }
  }, [currentPage, paginationData.hasNextPage, debouncedNavigation]);

  const goToPreviousPage = useCallback(() => {
    if (paginationData.hasPreviousPage) {
      debouncedNavigation('previous_page', currentPage - 1);
    }
  }, [currentPage, paginationData.hasPreviousPage, debouncedNavigation]);

  const goToFirstPage = useCallback(() => {
    if (!paginationData.isFirstPage) {
      debouncedNavigation('first_page', 1);
    }
  }, [paginationData.isFirstPage, debouncedNavigation]);

  const goToLastPage = useCallback(() => {
    if (!paginationData.isLastPage) {
      debouncedNavigation('last_page', paginationData.totalPages);
    }
  }, [paginationData.isLastPage, paginationData.totalPages, debouncedNavigation]);

  // Advanced page size change with analytics
  const changePageSize = useCallback((newPageSize) => {
    setItemsPerPage(newPageSize);
    setCurrentPage(1);
    trackNavigation('change_page_size', newPageSize);
  }, [trackNavigation]);

  // Reset pagination
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    trackNavigation('reset_pagination', 1);
  }, [trackNavigation]);

  // Smart page number generation
  const getPageNumbers = useCallback(() => {
    const pages = [];
    const { totalPages } = paginationData;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [currentPage, paginationData.totalPages, maxPagesToShow]);

  // Keyboard navigation
  const handleKeyPress = useCallback((event) => {
    if (event.target.tagName === 'INPUT') return; // Don't interfere with input fields
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        goToPreviousPage();
        break;
      case 'ArrowRight':
        event.preventDefault();
        goToNextPage();
        break;
      case 'Home':
        event.preventDefault();
        goToFirstPage();
        break;
      case 'End':
        event.preventDefault();
        goToLastPage();
        break;
    }
  }, [goToPreviousPage, goToNextPage, goToFirstPage, goToLastPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    currentPageData,
    currentPage,
    itemsPerPage,
    isNavigating,
    ...paginationData,
    startIndex: paginationData.startIndex + 1, // 1-based for display
    endIndex: Math.min(paginationData.endIndex, paginationData.totalItems),
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    changePageSize,
    resetPagination,
    getPageNumbers,
    handleKeyPress,
  };
};