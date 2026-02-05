import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { notifySuccess, notifyError } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { invitationService } from '../services';
import { makeGetRequest } from '@/lib/api';

interface Role {
    id: string;
    name: string;
    description: string | null;
}

interface CreateInvitationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export const CreateInvitationModal: React.FC<CreateInvitationModalProps> = ({
    open,
    onOpenChange,
    onSuccess,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [roleId, setRoleId] = useState('');
    const [roles, setRoles] = useState<Role[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(false);

    // Fetch roles from API
    useEffect(() => {
        const fetchRoles = async () => {
            setLoadingRoles(true);
            try {
                const response = await makeGetRequest<{ success: boolean; data: Role[] }>('rbac/roles');
                setRoles(response.data.data.filter(role => role.name !== 'user'));
            } catch (error) {
                console.error('Failed to fetch roles:', error);
                // Fallback to empty array
                setRoles([]);
            } finally {
                setLoadingRoles(false);
            }
        };

        if (open) {
            fetchRoles();
        }
    }, [open]);

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setRoleId('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !roleId) {
            notifyError('Please fill all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await invitationService.createInvitation({
                first_name: firstName,
                last_name: lastName,
                email: email,
                assigned_role_id: roleId,
            });
            notifySuccess('Invitation sent successfully!');
            resetForm();
            onOpenChange(false);
            onSuccess();
        } catch (error: any) {
            console.error('Failed to create invitation:', error);
            const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to send invitation';
            notifyError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <DialogTitle className="text-xl font-bold text-[#253154]">
                        Create Invitation
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                        Send an invitation to add a new admin user
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                    {/* First Name */}
                    <div className="space-y-2">
                        <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                            First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="first_name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter first name"
                            className="h-11 rounded-lg border-gray-200"
                            required
                        />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                        <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                            Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="last_name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter last name"
                            className="h-11 rounded-lg border-gray-200"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            className="h-11 rounded-lg border-gray-200"
                            required
                        />
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="assigned_role_id" className="text-sm font-medium text-gray-700">
                            Role <span className="text-red-500">*</span>
                        </Label>
                        <Select value={roleId} onValueChange={setRoleId} disabled={loadingRoles}>
                            <SelectTrigger className="h-11 rounded-lg border-gray-200 **:data-description:hidden text-left">
                                <SelectValue placeholder={loadingRoles ? "Loading roles..." : "Select a role"} />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                        <div className="flex flex-col items-start text-left">
                                            <span className="font-medium">
                                                {role.name.toLowerCase() === 'superadmin'
                                                    ? 'Super Admin'
                                                    : role.name.toLowerCase() === 'admin'
                                                        ? 'Admin'
                                                        : role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                            </span>
                                            {role.description && (
                                                <span data-description className="text-xs text-gray-400 mt-0.5">{role.description}</span>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1 h-11 rounded-lg"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 h-11 rounded-lg bg-[#0e042f] hover:bg-[#0e042f]/90 text-white"
                            disabled={isSubmitting || loadingRoles}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Invitation'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
