import {
    makeGetRequestWithParams,
    makeGetRequest,
    makePostRequest,
    makePutRequest,
    makeDeleteRequest,
} from '@/lib/api';
import { logger } from '@/lib/utils/logger';
import type {
    InvitationListResponse,
    InvitationQueryParams,
    InvitationFormData,
    Invitation,
    InvitationDetailsResponse,
    AcceptInvitationData,
    AcceptInvitationResponse,
} from '../types';

const API_BASE = 'admin/invitations';

interface Role {
    id: string;
    name: string;
}

// Cache for roles to avoid multiple API calls
let rolesCache: Role[] | null = null;

async function fetchRoles(): Promise<Role[]> {
    if (rolesCache) return rolesCache;
    try {
        const response = await makeGetRequest<{ success: boolean; data: Role[] }>('rbac/roles');
        rolesCache = response.data.data;
        return rolesCache;
    } catch (error) {
        logger.error('[InvitationService] Failed to fetch roles', error);
        return [];
    }
}

export const invitationService = {
    /**
     * Get list of invitations with optional filtering and pagination
     */
    getInvitations: async (params: InvitationQueryParams): Promise<InvitationListResponse['data']> => {
        logger.debug('[InvitationService] Fetching invitations with params', params);

        const [response, roles] = await Promise.all([
            makeGetRequestWithParams<InvitationListResponse>(API_BASE, params),
            fetchRoles(),
        ]);

        // Map role IDs to names for display
        const invitations = response.data.data.invitations.map((inv: Invitation) => ({
            ...inv,
            assigned_role_name: roles.find(r => r.id === inv.assigned_role_id)?.name || 'Unknown',
        }));

        return {
            ...response.data.data,
            invitations,
        };
    },

    /**
     * Create a new invitation and send email
     */
    createInvitation: async (data: InvitationFormData): Promise<Invitation> => {
        logger.debug('[InvitationService] Creating invitation', data);

        const response = await makePostRequest<{ success: boolean; data: Invitation; message: string }>(
            API_BASE,
            data
        );

        return response.data.data;
    },

    /**
     * Delete/revoke an invitation
     */
    deleteInvitation: async (id: number): Promise<void> => {
        logger.debug('[InvitationService] Deleting invitation', { id });

        await makeDeleteRequest<{ success: boolean; message: string }>(
            `${API_BASE}/${id}`
        );
    },

    /**
     * Update an invitation (superadmin only)
     */
    updateInvitation: async (id: number, data: InvitationFormData): Promise<Invitation> => {
        logger.debug('[InvitationService] Updating invitation', { id, data });

        const response = await makePutRequest<{ success: boolean; data: Invitation; message: string }>(
            `${API_BASE}/update/${id}`,
            data
        );

        return response.data.data;
    },

    /**
     * Get invitation details by token (for accept invitation flow)
     * This is a PUBLIC endpoint - no auth required
     */
    getInvitationDetails: async (token: string): Promise<InvitationDetailsResponse['data']> => {
        logger.debug('[InvitationService] Getting invitation details by token');

        // Use fetch directly since this is a public endpoint
        const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
        const response = await fetch(`${baseUrl}/${API_BASE}/details?token=${token}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to get invitation details');
        }

        const data = await response.json();
        return data.data;
    },

    /**
     * Accept an invitation and create user account
     * This is a PUBLIC endpoint - no auth required
     */
    acceptInvitation: async (data: AcceptInvitationData): Promise<AcceptInvitationResponse['data']> => {
        logger.debug('[InvitationService] Accepting invitation');

        // Use fetch directly since this is a public endpoint
        const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
        const response = await fetch(`${baseUrl}/${API_BASE}/accept`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: data.token,
                email: data.email,
                password: data.password,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to accept invitation');
        }

        const result = await response.json();
        return result.data;
    },
};
