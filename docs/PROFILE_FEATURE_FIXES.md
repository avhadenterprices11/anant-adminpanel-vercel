# Profile Feature - Bug Fixes & Best Practices Review

## Date: 5 February 2026

## Critical Issues Fixed

### 1. **Navigation Blocking Bug** ❌ → ✅
**Problem**: Navigation wasn't working properly when trying to leave the profile page
- The `useUnsavedChangesWarning` hook was blocking navigation but the state wasn't resolving correctly
- Missing `useNavigate` import from react-router-dom
- `handleBack` was using a wrapper function that didn't properly handle the blocking state

**Fix**:
- Added `useNavigate` hook import
- Changed `handleBack` to check `isDirty` state first, then navigate directly
- Fixed blocker callback to use ref for `hasUnsavedChanges` to avoid stale closures
- Properly reset form state before proceeding with navigation

### 2. **Race Condition in useEffect** ⚠️ → ✅
**Problem**: Infinite re-render loop due to dependencies in the profile initialization effect
- The effect that initialized form data depended on `isDirty` and `imageFile`, causing it to re-run after user interactions
- This would reset the form back to initial values unintentionally

**Fix**:
- Removed `isDirty` and `imageFile` from useEffect dependencies
- Added condition to only initialize once: `if (profile && Object.keys(formData).length === 0)`
- Created refs to store initial values: `initialValuesRef` and `initialImageUrlRef`
- Form resets now use these refs instead of recalculating from profile

### 3. **Memory Leak - Blob URLs** 💧 → ✅
**Problem**: Object URLs created for image previews were never revoked
- Each time a user selected an image, a new blob URL was created but old ones weren't cleaned up
- This could lead to memory leaks with multiple image selections

**Fix**:
- Revoke previous blob URL before creating a new one in `handleImageChange`
- Added cleanup useEffect to revoke blob URL on component unmount
- Revoke blob URL in `resetForm` and after successful save

### 4. **Profile Update Not Awaited** 🔄 → ✅
**Problem**: `updateProfile` was fire-and-forget, causing timing issues
- Query invalidation wasn't waiting for the update to complete
- State wasn't properly synchronized after saves

**Fix**:
- Made `updateProfile` async and return the mutation promise
- Changed to use `mutateAsync` instead of `mutate`
- Added `await` to query invalidation in mutation success handler
- Updated `handleSaveProfile` to properly await the update

### 5. **Stale Initial Values** 📦 → ✅
**Problem**: After saving, the "initial values" for dirty checking weren't updated
- This meant after a successful save, any further edits would compare against the old initial values
- Could lead to incorrect dirty state detection

**Fix**:
- Update `initialValuesRef` and `initialImageUrlRef` after successful save
- Ensures subsequent edits properly detect dirty state

## Code Quality Improvements

### Type Safety ✅
- Properly typed all mutation callbacks
- Fixed TypeScript warnings around `UserProfile` type usage
- Added proper return types for async functions

### State Management ✅
- Centralized initial values in refs to avoid recalculation
- Clear state lifecycle: Initialize → Edit → Save/Discard → Reset
- Proper cleanup of transient state (blob URLs, file objects)

### Error Handling ✅
- Added try-catch blocks in async operations
- Proper error messages via toast notifications
- Graceful fallbacks for missing data

### Performance ✅
- Reduced unnecessary re-renders by fixing useEffect dependencies
- Prevented infinite loops with proper condition checks
- Efficient state updates with minimal rerenders

## Best Practices Applied

### 1. **Ref Usage for Values That Don't Need Re-renders**
```typescript
const initialValuesRef = useRef<Partial<ProfileFormData>>({});
const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
```

### 2. **Cleanup Effects**
```typescript
useEffect(() => {
  return () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
  };
}, [imagePreview]);
```

### 3. **Async Mutation Handling**
```typescript
const updateProfile = async (updates: Partial<UserProfile>) => {
  return await profileMutation.mutateAsync(updates);
};
```

### 4. **Proper Navigation with Guards**
```typescript
const handleBack = () => {
  if (isDirty) {
    setShowDiscardDialog(true);
  } else {
    navigate('/dashboard');
  }
};
```

## Testing Recommendations

### Unit Tests Needed
1. Test `handleImageChange` memory cleanup
2. Test `resetForm` properly revokes blob URLs
3. Test `handleSaveProfile` updates initial refs
4. Test navigation blocking/unblocking flow

### Integration Tests Needed
1. Full user flow: Edit → Cancel → Verify no changes
2. Full user flow: Edit → Save → Verify changes persisted
3. Full user flow: Edit → Navigate away → Discard/Continue
4. Test image upload + profile update together

### Manual Testing
- [x] Navigate to profile page
- [x] Make changes without saving → Try to navigate → Should block
- [x] Discard changes → Should navigate successfully
- [x] Make changes → Save → Should navigate successfully
- [x] Upload multiple images → Check browser memory doesn't grow
- [x] Save profile → Make new edits → Dirty state should detect correctly

## Files Modified

1. `/src/features/profile/pages/ProfilePage.tsx`
   - Added useNavigate import and usage
   - Fixed useEffect race condition
   - Added memory cleanup for blob URLs
   - Fixed navigation handling
   - Added refs for initial values

2. `/src/features/profile/hooks/useProfile.ts`
   - Made updateProfile async
   - Fixed mutation to await query invalidation
   - Improved error handling

3. `/src/hooks/useUnsavedChangesWarning.ts`
   - Fixed stale closure issue with ref
   - Improved blocker stability

4. `/src/services/userService.ts`
   - Added support for profile_image_url mapping

## Additional Notes

### Profile Picture Update
The profile picture update in ProfileOverview.tsx works correctly, but the main profile form now also supports image updates through the form's image uploader, providing two ways to update:
1. Quick update via avatar hover in ProfileOverview
2. Full form update in PersonalInformation tab

Both methods now properly:
- Upload to backend
- Update user profile via API
- Dispatch events to update header
- Handle errors gracefully
- Show loading states

### Future Improvements

1. **Debounce Dirty State Check**
   - Could add debouncing to prevent excessive dirty state calculations
   
2. **Optimistic Updates**
   - Show changes immediately while API call is in progress
   
3. **Better Error Recovery**
   - If image upload fails, keep the form data so user doesn't lose other changes
   
4. **Confirmation on Image Change**
   - Consider asking user before replacing their profile picture

5. **Image Compression**
   - Add client-side image compression before upload to reduce bandwidth

## Summary

All critical bugs have been fixed:
- ✅ Navigation now works correctly with unsaved changes protection
- ✅ No more race conditions or infinite loops
- ✅ Memory leaks from blob URLs eliminated  
- ✅ Profile updates properly awaited and synchronized
- ✅ Code follows React best practices
- ✅ Type safety improved throughout

The profile feature is now production-ready with proper error handling, memory management, and user experience.
