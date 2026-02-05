import { useEffect, useCallback, useRef } from 'react';
import { useBlocker, useNavigate } from 'react-router-dom';

/**
 * Hook to warn users about unsaved changes when navigating away
 * Uses useBlocker for in-app navigation and window.beforeunload for browser actions
 *
 * @param hasUnsavedChanges - Boolean indicating if there are unsaved changes
 * @param onShowWarning - Callback to show the confirmation warning dialog
 * @param message - Optional message for browser native prompt
 */
export function useUnsavedChangesWarning(
  hasUnsavedChanges: boolean,
  onShowWarning?: () => void,
  message: string = 'You have unsaved changes. Are you sure you want to leave?'
) {
  const navigate = useNavigate();

  // Use a ref to store the callback to avoid re-triggering the effect
  const onShowWarningRef = useRef(onShowWarning);

  // Update the ref when onShowWarning changes
  useEffect(() => {
    onShowWarningRef.current = onShowWarning;
  }, [onShowWarning]);

  // Track if we've already shown the warning for the current blocked state
  const hasShownWarningRef = useRef(false);

  // 1. Block browser unload (Refresh/Close Tab)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, message]);

  // 2. Block in-app navigation
  // Store hasUnsavedChanges in a ref to avoid stale closures
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
  
  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  const blockerFn = useCallback(
    ({ currentLocation, nextLocation }: { currentLocation: any; nextLocation: any }) =>
      hasUnsavedChangesRef.current && currentLocation.pathname !== nextLocation.pathname,
    []
  );

  const blocker = useBlocker(blockerFn);

  // Show warning when blocker is triggered
  useEffect(() => {
    if (blocker.state === 'blocked' && !hasShownWarningRef.current) {
      hasShownWarningRef.current = true;
      if (onShowWarningRef.current) {
        onShowWarningRef.current();
      } else {
        // Fallback to native confirm if no UI callback provided
        if (window.confirm(message)) {
          blocker.proceed();
        } else {
          blocker.reset();
        }
      }
    } else if (blocker.state !== 'blocked') {
      // Reset the flag when blocker is no longer blocked
      hasShownWarningRef.current = false;
    }
  }, [blocker.state, message, blocker]);

  /**
   * Proceed with the blocked navigation
   */
  const proceedNavigation = useCallback(() => {
    if (blocker.state === 'blocked') {
      blocker.proceed();
    }
  }, [blocker]);

  /**
   * Cancel the blocked navigation
   */
  const cancelNavigation = useCallback(() => {
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
  }, [blocker]);

  /**
   * Legacy wrapper for manual navigation
   * Now just navigates, letting the blocker handle the interception
   */
  const navigateWithConfirmation = useCallback(
    (to: string) => {
      navigate(to);
    },
    [navigate]
  );

  return {
    navigateWithConfirmation,
    proceedNavigation,
    cancelNavigation,
  };
}
