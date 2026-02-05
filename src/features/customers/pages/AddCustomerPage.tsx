import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { CustomerForm } from '../components';
import { ROUTES } from '@/lib/constants';
import { customerService } from '../services/customerService';
import type { CustomerFormData } from '../types/customer.types';

// Helper function to convert empty strings to undefined
const sanitizeValue = <T,>(value: T): T | undefined => {
  if (value === '' || value === null) return undefined;
  if (Array.isArray(value) && value.length === 0) return undefined;
  return value;
};

// Helper function to map payment terms to backend enum format
const mapPaymentTerms = (terms?: string): string | undefined => {
  if (!terms) return undefined;
  // Convert common formats to backend enum: 'immediate', 'net_15', 'net_30', 'net_60', 'net_90'
  const normalized = terms.toLowerCase().replace(/\s+/g, '_').replace('net-', 'net_');
  const validTerms = ['immediate', 'net_15', 'net_30', 'net_60', 'net_90'];
  return validTerms.includes(normalized) ? normalized : undefined;
};

// Helper function to map segment to backend enum format
const mapSegment = (segment?: string[]): string | undefined => {
  if (!segment || segment.length === 0) return undefined;
  const normalized = segment[0].toLowerCase().replace(/\s+/g, '_');
  const validSegments = ['new', 'regular', 'vip', 'at_risk'];
  return validSegments.includes(normalized) ? normalized : undefined;
};

export default function AddCustomerPage() {
  const navigate = useNavigate();

  const handleSubmit = async (_data: CustomerFormData) => {
    try {
      // Determine user type based on customer type
      const userType = _data.customerType === 'Retail' ? 'individual' : 'business';

      // Map frontend form data to backend API payload
      const payload = {
        first_name: _data.firstName.trim(), // First name
        last_name: _data.lastName.trim(), // Last name (required)
        display_name: sanitizeValue(_data.displayName),
        email: _data.email,
        phone_number: sanitizeValue(_data.phone),
        user_type: userType,
        tags: _data.internalTags && _data.internalTags.length > 0 ? _data.internalTags : undefined,
        date_of_birth: sanitizeValue(_data.dateOfBirth),
        gender: sanitizeValue(_data.gender?.toLowerCase()),
        preferred_language: sanitizeValue(_data.language?.[0]),
        languages: _data.language && _data.language.length > 0 ? _data.language : undefined,

        // Business fields (only include if business type)
        ...(userType === 'business' ? {
          company_legal_name: sanitizeValue(_data.companyName),
          tax_id: sanitizeValue(_data.gstNumber),
          credit_limit: _data.creditLimit && _data.creditLimit > 0 ? _data.creditLimit : undefined,
          payment_terms: mapPaymentTerms(_data.paymentTerms),
        } : {}),

        // Profile fields
        profile_image_url: typeof _data.profileImage === 'string' ? _data.profileImage : undefined,
        segment: mapSegment(_data.segment),
        notes: sanitizeValue(_data.internalNotes),

        // Secondary contacts (limit of 2 emails/phones)
        secondary_email: sanitizeValue(_data.secondaryEmail),
        secondary_phone_number: sanitizeValue(_data.secondaryPhone),
      };

      // Remove undefined values from payload
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined)
      );

      console.log('Creating customer with payload:', cleanPayload);
      const response = await customerService.createCustomer(cleanPayload as any);

      // Save addresses if customer was created successfully and has addresses
      if (response?.id && _data.addresses && _data.addresses.length > 0) {
        const addressPromises = _data.addresses.map(async (addr) => {
          // Map frontend address type to backend format
          const mapAddressType = (type?: string): 'Home' | 'Office' | 'Other' => {
            if (!type) return 'Home';
            const lower = type.toLowerCase();
            if (lower === 'home') return 'Home';
            if (lower === 'office') return 'Office';
            return 'Other';
          };

          try {
            await customerService.createAddress(response.id, {
              type: mapAddressType(addr.addressType),
              name: addr.name || `${_data.firstName} ${_data.lastName}`.trim() || 'Customer',
              phone: _data.phone || 'N/A',
              addressLine1: addr.streetAddress1 || 'Address',
              addressLine2: addr.streetAddress2 || undefined,
              city: addr.city || 'City',
              state: addr.state || 'State',
              pincode: addr.pincode || '000000',
              country: addr.country || 'India',
              isDefault: addr.isDefaultBilling || addr.isDefaultShipping || false,
              isDefaultBilling: addr.isDefaultBilling,
              isDefaultShipping: addr.isDefaultShipping,
            });
          } catch (addrError) {
            console.error('Failed to create address:', addrError);
            // Continue with other addresses even if one fails
          }
        });

        await Promise.all(addressPromises);
      }

      toast.success('Customer created successfully');

      // Navigate to the new customer's detail page
      if (response?.id) {
        navigate(ROUTES.CUSTOMERS.DETAIL(response.id));
      } else {
        navigate(ROUTES.CUSTOMERS.LIST);
      }
    } catch (error: any) {
      logger.error('Error creating customer:', error);

      // Extract error message, ensuring it's a string
      const rawMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || '';
      const errorMessage = typeof rawMessage === 'string' ? rawMessage : JSON.stringify(rawMessage);
      const errorLower = errorMessage.toLowerCase();

      // Check for duplicate email error
      const isDuplicateEmail =
        (errorLower.includes('email') || errorLower.includes('unique_email') || errorLower.includes('users_email_key')) &&
        (errorLower.includes('exist') || errorLower.includes('duplicate') || errorLower.includes('unique') || errorLower.includes('already') || errorLower.includes('constraint'));

      if (isDuplicateEmail || error?.response?.status === 409) {
        toast.error('Email already exists');
      } else {
        toast.error(errorMessage || 'Failed to create customer');
      }
    }
  };

  return <CustomerForm onSubmit={handleSubmit} />;
}

