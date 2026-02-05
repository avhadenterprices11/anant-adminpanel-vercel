export type InvitationStatus = 'pending' | 'accepted' | 'revoked' | 'expired';

export interface Invitation {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    status: InvitationStatus;
    assigned_role_id: string | null;
    assigned_role_name?: string;
    invited_by: string;
    invited_by_name?: string;
    expires_at: string;
    accepted_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface InvitationFormData {
    first_name: string;
    last_name: string;
    email: string;
    assigned_role_id: string;
}

export interface InvitationQueryParams {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    roleId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface InvitationListResponse {
    success: boolean;
    data: {
        invitations: Invitation[];
        total: number;
        page: number;
        limit: number;
    };
    message: string;
}

export interface InvitationDetailsResponse {
    success: boolean;
    data: {
        first_name: string;
        last_name: string;
        email: string;
    };
    message: string;
}

export interface AcceptInvitationData {
    token: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone_number?: string;
}

export interface AcceptInvitationResponse {
    success: boolean;
    data: {
        user: {
            id: string;
            auth_id: string;
            name: string;
            email: string;
            phone_number?: string;
            created_at: string;
            updated_at: string;
        };
        session: {
            access_token: string;
            refresh_token: string;
            expires_in: number;
            token_type: string;
        };
    };
    message: string;
}

export interface RoleOption {
    id: string;
    name: string;
    description?: string;
}
