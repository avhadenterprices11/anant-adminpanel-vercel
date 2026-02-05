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
import type { Invitation } from '../types';

interface Role {
    id: string;
    name: string;
    description: string | null;
}

interface EditInvitationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    invitation: Invitation | null;
}

export const EditInvitationModal: React.FC<EditInvitationModalProps> = ({
    open,
    onOpenChange,
    onSuccess,
    invitation,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [roleId, setRoleId] = useState('');
    const [roles, setRoles] = useState<Role[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(false);

    // Load invitation data when modal opens
    useEffect(() => {
        if (invitation && open) {
            setFirstName(invitation.first_name);
            setLastName(invitation.last_name);
            setEmail(invitation.email);
            setRoleId(invitation.assigned_role_id || '');
        }
    }, [invitation, open]);

    // Fetch roles from API
    useEffect(() => {
        const fetchRoles = async () => {
            setLoadingRoles(true);
            try {
                const response = await makeGetRequest<{ success: boolean; data: Role[] }>('rbac/roles');
                setRoles(response.data.data.filter(role => role.name !== 'user'));
            } catch (error) {
                console.error('Failed to fetch roles:', error);
                setRoles([]);
            } finally {
                setLoadingRoles(false);
            }
        };

        if (open) {
            fetchRoles();
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !roleId || !invitation) {
            notifyError('Please fill all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await invitationService.updateInvitation(invitation.id, {
                first_name: firstName,
                last_name: lastName,
                email: email,
                assigned_role_id: roleId,
            });
            notifySuccess('Invitation updated successfully!');
            onOpenChange(false);
            onSuccess();
        } catch (error) {
            console.error('Failed to update invitation:', error);
            notifyError(error instanceof Error ? error.message : 'Failed to update invitation');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <DialogTitle className="text-xl font-bold text-[#253154]">
                        Edit Invitation
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                        Update invitation details
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                    {/* First Name */}
                    <div className="space-y-2">
                        <Label htmlFor="edit_first_name" className="text-sm font-medium text-gray-700">
                            First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="edit_first_name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter first name"
                            className="h-11 rounded-lg border-gray-200"
                            required
                        />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                        <Label htmlFor="edit_last_name" className="text-sm font-medium text-gray-700">
                            Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="edit_last_name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter last name"
                            className="h-11 rounded-lg border-gray-200"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="edit_email" className="text-sm font-medium text-gray-700">
                            Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="edit_email"
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
                        <Label htmlFor="edit_role" className="text-sm font-medium text-gray-700">
                            Role <span className="text-red-500">*</span>
                        </Label>
                        <Select value={roleId} onValueChange={setRoleId} disabled={loadingRoles}>
                            <SelectTrigger className="h-11 rounded-lg border-gray-200 text-left bg-white focus:ring-0 focus:ring-offset-0">
                                <SelectValue placeholder={loadingRoles ? "Loading roles..." : "Select a role"} />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                        <div className="flex flex-col text-left">
                                            <span className="font-medium text-[#253154]">{role.name}</span>
                                            {role.description && (
                                                <span className="text-xs text-gray-400">{role.description}</span>
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
                                    Updating...
                                </>
                            ) : (
                                'Update Invitation'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
