import { BookOpen } from 'lucide-react';
import { FormSection } from '@/components/forms';

export function TagGuidelinesSection() {
    return (
        <FormSection icon={BookOpen} title="Tag Guidelines">
            <div className="space-y-2 text-sm text-gray-600">
                <ul className="list-disc list-inside space-y-1">
                    <li>Names converted to lowercase</li>
                    <li>Use descriptive names</li>
                    <li>Product tags categorize items</li>
                    <li>Inactive tags are hidden</li>
                </ul>
            </div>
        </FormSection>
    );
}
