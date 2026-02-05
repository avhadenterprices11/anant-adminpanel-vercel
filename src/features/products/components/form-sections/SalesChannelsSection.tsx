
import { Globe } from 'lucide-react';
import { FormSection } from '@/components/forms';
import { salesChannelOptions } from '@/features/products/constants';
import type { SalesChannelsSectionProps } from '@/features/products/types/component.types';
import { cn } from '@/lib/utils';

export function SalesChannelsSection({
    formData,
    handleInputChange
}: SalesChannelsSectionProps) {
    const currentChannels = formData.salesChannels || [];

    const handleToggle = (channel: string) => {
        let newChannels = [...currentChannels];

        if (newChannels.includes(channel)) {
            newChannels = newChannels.filter(c => c !== channel);
        } else {
            newChannels.push(channel);
        }

        handleInputChange('salesChannels', newChannels);
    };

    return (
        <FormSection icon={Globe} title="Sales & Channels">
            <div className="space-y-3">
                {salesChannelOptions.map((channel) => {
                    const isSelected = currentChannels.includes(channel);

                    return (
                        <div
                            key={channel}
                            onClick={() => handleToggle(channel)}
                            className={cn(
                                "flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
                                isSelected
                                    ? "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]"
                                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-600"
                            )}
                        >
                            <div className={cn(
                                "flex items-center justify-center mr-3 h-5 w-5 rounded-full border-2 transition-colors",
                                isSelected
                                    ? "border-[#4F46E5]"
                                    : "border-slate-300"
                            )}>
                                {isSelected && (
                                    <div className="h-2.5 w-2.5 rounded-full bg-[#4F46E5]" />
                                )}
                            </div>
                            <span className="font-medium text-sm">{channel}</span>
                        </div>
                    );
                })}
            </div>
        </FormSection>
    );
}
