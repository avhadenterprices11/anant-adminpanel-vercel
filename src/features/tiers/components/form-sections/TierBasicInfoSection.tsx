import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TierBasicInfoSectionProps {
    name: string;
    code: string;
    description: string;
    onNameChange: (value: string) => void;
    onCodeChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    errors?: {
        name?: string;
        code?: string;
        description?: string;
    };
}

/**
 * Tier Basic Info Section
 * Handles tier name, code/slug, and description
 */
export function TierBasicInfoSection({
    name,
    code,
    description,
    onNameChange,
    onCodeChange,
    onDescriptionChange,
    errors = {},
}: TierBasicInfoSectionProps) {
    return (
        <Card className="rounded-[20px] border-slate-200">
            <CardContent className="p-6 space-y-4">
                {/* Tier Name */}
                <div>
                    <Label htmlFor="tier-name" className="block text-sm font-medium text-slate-900 mb-2">
                        Tier Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="tier-name"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder="e.g., Water Purifiers"
                        className={`rounded-xl ${errors.name ? 'border-red-300' : ''}`}
                    />
                    {errors.name && (
                        <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                    )}
                </div>

                {/* Tier Code/Slug */}
                <div>
                    <Label htmlFor="tier-code" className="block text-sm font-medium text-slate-900 mb-2">
                        Tier Code / Slug
                    </Label>
                    <Input
                        id="tier-code"
                        value={code}
                        onChange={(e) => onCodeChange(e.target.value)}
                        placeholder="e.g., water-purifiers"
                        className={`font-mono rounded-xl ${errors.code ? 'border-red-300' : ''}`}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        Used for URLs and system references (lowercase, hyphens only)
                    </p>
                    {errors.code && (
                        <p className="text-xs text-red-600 mt-1">{errors.code}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <Label htmlFor="tier-description" className="block text-sm font-medium text-slate-900 mb-2">
                        Description
                    </Label>
                    <Textarea
                        id="tier-description"
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        placeholder="Optional description for this tier..."
                        rows={4}
                        className="rounded-xl resize-none"
                    />
                    {errors.description && (
                        <p className="text-xs text-red-600 mt-1">{errors.description}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
