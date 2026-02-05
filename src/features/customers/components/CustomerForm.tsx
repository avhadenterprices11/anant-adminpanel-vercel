import React, { useState } from 'react';
import { MoreVertical, Trash2, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { type CustomerFormProps } from '@/features/customers/types/customer.types';
import { useCustomerForm } from '../hooks/useCustomerForm';
import { useCustomerFormHandlers } from '../hooks/useCustomerFormHandlers';
import {
    BasicInformationSection,
    ContactInformationSection,
    AddressesSection,
    ClassificationSection
} from './form-sections';
import {
    VerificationSection,
    // SecuritySection,
    // BanSection,
    OrderOverviewSection,
    ActivityTimelineSection,
    // AbandonedCartsSection,
    PaymentInfoSection
} from './edit-sections';
import { NotesTags } from '@/components/features/notes';
import { AddressModal } from '../modals/AddressModal';
import { PageHeader } from '@/components/layout/PageHeader';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmationDialog } from '@/components/dialogs/ConfirmationDialog';
import { UnsavedChangesDialog } from '@/components/dialogs/UnsavedChangesDialog';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';

export const CustomerForm: React.FC<CustomerFormProps> = ({
    initialData,
    onSubmit,
    isEditMode = false,
    customerName,
    onDelete,
    breadcrumbs,
    orders,
    payments,
    ordersPagination,
    paymentsPagination,
    onNavigateToOrder
}) => {
    const customerFormState = useCustomerForm(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showDiscardDialog, setShowDiscardDialog] = useState(false);

    const { navigateWithConfirmation, proceedNavigation, cancelNavigation } =
        useUnsavedChangesWarning(customerFormState.hasChanges && !isSaving, () => setShowDiscardDialog(true));

    const handleFormSubmit = (data: any) => {
        setIsSaving(true);
        setTimeout(() => onSubmit(data), 0);
    };

    const handlers = useCustomerFormHandlers({
        customerFormState,
        onSubmit: handleFormSubmit
    });

    const handleBack = () => {
        navigateWithConfirmation(ROUTES.CUSTOMERS.LIST);
    };

    const handleDiscardChanges = () => {
        setShowDiscardDialog(false);
        proceedNavigation();
    };

    const handleContinueEditing = () => {
        cancelNavigation();
        setShowDiscardDialog(false);
    };

    return (
        <div className="flex-1 w-full">
            <PageHeader
                title={isEditMode ? (customerName || 'Edit Customer') : 'Add Customer'}
                subtitle={isEditMode ? `Customer ID: ${customerFormState.customerId || '---'}` : 'Create a new customer profile with comprehensive details'}
                breadcrumbs={breadcrumbs || [
                    { label: 'Customers', onClick: handleBack },
                    { label: isEditMode ? 'Edit' : 'Add New', active: true }
                ]}
                backIcon="arrow"
                onBack={handleBack}
                actions={
                    <>
                        {/* Show Cancel and Save only when there are changes (in edit mode) or always in add mode */}
                        {(!isEditMode || customerFormState.hasChanges) && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleBack}
                                    className="rounded-xl h-[44px] px-6"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handlers.handleSave}
                                    className="rounded-xl bg-[var(--sidebar-bg)] hover:bg-[var(--sidebar-hover)] text-[var(--text-white)]/90 h-[44px] px-6 gap-2 shadow-sm"
                                >
                                    {isEditMode ? 'Save Changes' : (
                                        <>
                                            <Plus className="size-[18px]" />
                                            Add Customer
                                        </>
                                    )}
                                </Button>
                            </>
                        )}

                        {isEditMode && onDelete && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-10 w-10">
                                        <MoreVertical className="size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => setShowDeleteDialog(true)}
                                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                    >
                                        <Trash2 className="size-4 mr-2" />
                                        Delete Customer
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </>
                }
            />

            <ConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={() => {
                    setShowDeleteDialog(false);
                    onDelete?.();
                }}
                title="Delete Customer"
                description="Are you sure you want to delete this customer? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />

            <UnsavedChangesDialog
                open={showDiscardDialog}
                onOpenChange={setShowDiscardDialog}
                onDiscard={handleDiscardChanges}
                onContinueEditing={handleContinueEditing}
            />

            <div className="px-6 lg:px-8 pb-8">
                {/* Main Layout: 2-Column */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* LEFT COLUMN - All Content (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 1. Basic Information */}
                        <BasicInformationSection
                            profilePreview={customerFormState.profilePreview}
                            firstName={customerFormState.firstName}
                            setFirstName={customerFormState.setFirstName}
                            lastName={customerFormState.lastName}
                            setLastName={customerFormState.setLastName}
                            displayName={customerFormState.displayName}
                            setDisplayName={customerFormState.setDisplayName}
                            fullName={customerFormState.fullName}
                            customerId={customerFormState.customerId}
                            gender={customerFormState.gender}
                            setGender={customerFormState.setGender}
                            dateOfBirth={customerFormState.dateOfBirth}
                            setDateOfBirth={customerFormState.setDateOfBirth}
                            handleProfileImageChange={customerFormState.handleProfileImageChange}
                            handleRemoveImage={customerFormState.handleRemoveImage}
                        />

                        {/* 2. Contact Information (Merged) */}
                        <ContactInformationSection
                            emails={customerFormState.emails}
                            handleAddEmail={customerFormState.handleAddEmail}
                            handleRemoveEmail={customerFormState.handleRemoveEmail}
                            handleEmailChange={customerFormState.handleEmailChange}
                            handleSetPrimaryEmail={customerFormState.handleSetPrimaryEmail}
                            handleVerifyEmail={customerFormState.handleVerifyEmail}
                            handleVerifyOtp={customerFormState.handleVerifyOtp}
                            phones={customerFormState.phones}
                            handleAddPhone={customerFormState.handleAddPhone}
                            handleRemovePhone={customerFormState.handleRemovePhone}
                            handlePhoneChange={customerFormState.handlePhoneChange}
                            handleSetPrimaryPhone={customerFormState.handleSetPrimaryPhone}
                            handleVerifyPhone={customerFormState.handleVerifyPhone}
                            handleVerifyPhoneOtp={customerFormState.handleVerifyPhoneOtp}
                        />

                        {/* 3. Customer Addresses */}
                        <AddressesSection
                            addresses={customerFormState.addresses}
                            handleOpenAddressModal={customerFormState.handleOpenAddressModal}
                            handleEditAddress={customerFormState.handleEditAddress}
                            handleDeleteAddress={customerFormState.handleDeleteAddress}
                        />



                        {/* Order Overview - Edit Mode Only */}
                        {isEditMode && (
                            <OrderOverviewSection 
                                orders={orders} 
                                pagination={ordersPagination} 
                                onNavigateToOrder={onNavigateToOrder}
                            />
                        )}

                        {/* Payment Information - Edit Mode Only */}
                        {isEditMode && (
                            <PaymentInfoSection transactions={payments} pagination={paymentsPagination} />
                        )}




                        {/* Cart Abandonment - Commented Out */}
                        {/* {isEditMode && (
                            <AbandonedCartsSection
                                cartId="CART-2024-789"
                                abandonedOn="2024-12-15 08:30 PM"
                                totalValue="₹47,498"
                                products={[
                                    { id: '1', name: 'Nintendo Switch OLED', quantity: 1, price: '₹34,999' },
                                    { id: '2', name: 'Joy-Con Controllers', quantity: 2, price: '₹5,999' },
                                    { id: '3', name: 'Screen Protector', quantity: 1, price: '₹499' },
                                    { id: '4', name: 'Carrying Case', quantity: 1, price: '₹1,999' },
                                    { id: '5', name: 'Nintendo eShop Card', quantity: 2, price: '₹4,002' },
                                ]}
                                onClearCart={() => console.log('Clear cart')}
                                onSendReminder={() => console.log('Send reminder')}
                                onDeleteProduct={(productId) => console.log('Delete product:', productId)}
                            />
                        )} */}

                    </div>


                    {/* RIGHT COLUMN (1/3 width) */}
                    <div className="space-y-6">

                        {/* Customer Classification & Control (Moved here) */}
                        <ClassificationSection
                            accountStatus={customerFormState.accountStatus}
                            setAccountStatus={customerFormState.setAccountStatus}
                        />

                        {/* Ban Section - Commented Out */}
                        {/* <BanSection
                            isBanned={customerFormState.isBanned}
                            setIsBanned={customerFormState.setIsBanned}
                            banReason={customerFormState.banReason}
                            setBanReason={customerFormState.setBanReason}
                        /> */}

                        {/* Subscription - Commented Out */}
                        {/* <SubscriptionSection
                            formData={{
                                subscriptionPlan: customerFormState.subscriptionPlan,
                                subscriptionStatus: customerFormState.subscriptionStatus,
                                billingCycle: customerFormState.billingCycle,
                                subscriptionStartDate: customerFormState.subscriptionStartDate,
                                autoRenew: customerFormState.autoRenew
                            } as any}
                            setFormData={handlers.handleSubscriptionUpdate}
                            isEditing={true}
                        /> */}


                        {/* Loyalty Program - Commented Out */}
                        {/* <LoyaltySection
                            formData={{
                                loyaltyEnrolled: customerFormState.loyaltyEnrolled,
                                loyaltyTier: customerFormState.loyaltyTier,
                                loyaltyPoints: customerFormState.loyaltyPoints,
                                loyaltyEnrollmentDate: customerFormState.loyaltyEnrollmentDate
                            } as any}
                            setFormData={handlers.handleLoyaltyUpdate}
                            isEditing={true}
                        /> */}


                        {/* Preferences & Communication - Commented Out */}
                        {/* <PreferencesSection
                            marketingPreferences={customerFormState.marketingPreferences}
                            setMarketingPreferences={customerFormState.setMarketingPreferences}
                            emailNotifications={customerFormState.emailNotifications}
                            setEmailNotifications={customerFormState.setEmailNotifications}
                            smsNotifications={customerFormState.smsNotifications}
                            setSmsNotifications={customerFormState.setSmsNotifications}
                            whatsappNotifications={customerFormState.whatsappNotifications}
                            setWhatsappNotifications={customerFormState.setWhatsappNotifications}
                            emailSubscription={customerFormState.emailSubscription}
                            setEmailSubscription={customerFormState.setEmailSubscription}
                        /> */}




                        {/* Notes & Tags (Centralized) */}
                        <NotesTags
                            adminComment={customerFormState.internalNotes}
                            onAdminCommentChange={(val) => customerFormState.setInternalNotes(val)}
                            tags={customerFormState.internalTags}
                            onTagsChange={(tags) => customerFormState.setInternalTags(tags)}
                            availableTags={customerFormState.availableTags}
                            showCustomerNote={false}
                            tagType="customer"
                            onTagCreated={customerFormState.handleTagCreated}
                        />



                        {/* Verification (New) */}
                        <VerificationSection
                            formData={{
                                emailVerified: customerFormState.emails.some(e => e.isVerified),
                                phoneVerified: customerFormState.phones.some(p => p.isVerified),
                                gdprStatus: customerFormState.gdprStatus,
                                privacyPolicyVersion: customerFormState.privacyPolicyVersion,
                                marketingConsentDate: customerFormState.marketingConsentDate
                            } as any}
                        />

                        {/* Security */}
                        {/* <SecuritySection
                            formData={{
                                lastLoginDate: customerFormState.lastLoginDate,
                                lastLoginIP: customerFormState.lastLoginIP,
                                lastLogoutDate: customerFormState.lastLogoutDate,
                                failedLoginAttempts: customerFormState.failedLoginAttempts,
                                accountLockedUntil: customerFormState.accountLockedUntil
                            } as any}
                        /> */}

                        {/* Activity Timeline - Edit Mode Only */}
                        {isEditMode && (
                            <ActivityTimelineSection
                                activities={[
                                    { id: '1', type: 'order', title: 'Placed Order #SS-2024-156', description: 'PlayStation 5 Console + 2 Controllers', timestamp: '2024-12-10 03:30 PM', amount: '₹52,999' },
                                    { id: '2', type: 'payment', title: 'Payment Received', description: 'Order #SS-2024-156 - Online Payment', timestamp: '2024-12-10 03:32 PM', amount: '₹52,999' },
                                    { id: '3', type: 'login', title: 'Account Login', description: 'Logged in from Chrome on Windows', timestamp: '2024-12-09 11:20 AM' },
                                    { id: '4', type: 'order', title: 'Placed Order #SS-2024-142', description: 'Gaming Headset Pro + Controller', timestamp: '2024-11-28 05:15 PM', amount: '₹8,499' },
                                    { id: '5', type: 'payment', title: 'Payment Received', description: 'Order #SS-2024-142 - UPI Payment', timestamp: '2024-11-28 05:17 PM', amount: '₹8,499' },
                                    { id: '6', type: 'login', title: 'Account Login', description: 'Logged in from Safari on MacOS', timestamp: '2024-11-25 09:45 AM' },
                                    { id: '7', type: 'order', title: 'Placed Order #SS-2024-128', description: 'Gaming Monitor 27"', timestamp: '2024-11-15 02:20 PM', amount: '₹45,999' },
                                    { id: '8', type: 'payment', title: 'Payment Received', description: 'Order #SS-2024-128 - Net Banking', timestamp: '2024-11-15 02:22 PM', amount: '₹45,999' },
                                    { id: '9', type: 'login', title: 'Password Changed', description: 'Password updated successfully', timestamp: '2024-11-10 04:30 PM' },
                                    { id: '10', type: 'order', title: 'Placed Order #SS-2024-097', description: 'Gaming Mouse + Keyboard + Mouse Pad', timestamp: '2024-10-22 01:15 PM', amount: '₹18,999' },
                                    { id: '11', type: 'payment', title: 'Payment Refunded', description: 'Order #SS-2024-097 - Cancelled by customer', timestamp: '2024-10-23 11:00 AM', amount: '₹18,999' },
                                    { id: '12', type: 'login', title: 'Account Login', description: 'Logged in from Chrome on Android', timestamp: '2024-10-20 08:30 AM' },
                                    { id: '13', type: 'order', title: 'Placed Order #SS-2024-089', description: 'Wireless Earbuds Pro', timestamp: '2024-10-15 06:45 PM', amount: '₹24,999' },
                                    { id: '14', type: 'payment', title: 'Payment Received', description: 'Order #SS-2024-089 - Debit Card', timestamp: '2024-10-15 06:47 PM', amount: '₹24,999' },
                                    { id: '15', type: 'login', title: 'Account Login', description: 'Logged in from Firefox on Windows', timestamp: '2024-10-10 10:15 AM' },
                                    { id: '16', type: 'order', title: 'Placed Order #SS-2024-078', description: 'Smart TV 55" + Soundbar', timestamp: '2024-10-01 12:30 PM', amount: '₹67,500' },
                                    { id: '17', type: 'payment', title: 'Payment Pending', description: 'Order #SS-2024-078 - Awaiting confirmation', timestamp: '2024-10-01 12:32 PM', amount: '₹67,500' },
                                    { id: '18', type: 'login', title: 'Account Login', description: 'Logged in from Chrome on iOS', timestamp: '2024-09-28 07:00 AM' },
                                    { id: '19', type: 'order', title: 'Placed Order #SS-2024-065', description: 'Bluetooth Speaker', timestamp: '2024-09-20 04:20 PM', amount: '₹12,999' },
                                    { id: '20', type: 'payment', title: 'Payment Received', description: 'Order #SS-2024-065 - UPI Payment', timestamp: '2024-09-20 04:22 PM', amount: '₹12,999' },
                                ]}
                            />
                        )}

                    </div>
                </div>

                {/* Address Modal */}
                <AddressModal
                    isOpen={customerFormState.isAddressModalOpen}
                    onClose={() => customerFormState.setIsAddressModalOpen(false)}
                    editingAddressId={customerFormState.editingAddressId}
                    addressName={customerFormState.addressName}
                    setAddressName={customerFormState.setAddressName}
                    addressCountry={customerFormState.addressCountry}
                    setAddressCountry={customerFormState.setAddressCountry}
                    addressState={customerFormState.addressState}
                    setAddressState={customerFormState.setAddressState}
                    addressCity={customerFormState.addressCity}
                    setAddressCity={customerFormState.setAddressCity}
                    addressPincode={customerFormState.addressPincode}
                    setAddressPincode={customerFormState.setAddressPincode}
                    addressStreet1={customerFormState.addressStreet1}
                    setAddressStreet1={customerFormState.setAddressStreet1}
                    addressStreet2={customerFormState.addressStreet2}
                    setAddressStreet2={customerFormState.setAddressStreet2}
                    addressLandmark={customerFormState.addressLandmark}
                    setAddressLandmark={customerFormState.setAddressLandmark}
                    addressType={customerFormState.addressType}
                    setAddressType={customerFormState.setAddressType}
                    isDefaultBilling={customerFormState.isDefaultBilling}
                    setIsDefaultBilling={customerFormState.setIsDefaultBilling}
                    isDefaultShipping={customerFormState.isDefaultShipping}
                    setIsDefaultShipping={customerFormState.setIsDefaultShipping}
                    onSave={customerFormState.handleSaveAddress}
                />
            </div>
        </div>
    );
};
