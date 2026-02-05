import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select';
import { FormSection } from '@/components/forms';
import type { AvailabilitySectionProps } from '@/features/products/types/component.types';

export function AvailabilitySection({ formData, handleInputChange }: AvailabilitySectionProps) {
  return (
    <FormSection icon={Settings} title="Availability">
      {/* Product Status */}
      <div>
        <Label htmlFor="productStatus" className="text-sm font-medium text-slate-700 mb-2 block">
          Product Status <span className="text-amber-600">*</span>
        </Label>
        <Select
          value={formData.productStatus}
          onValueChange={(value) => handleInputChange('productStatus', value)}
        >
          <SelectTrigger id="productStatus" className="rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
            {/* <SelectItem value="schedule">Schedule</SelectItem> */}
          </SelectContent>
        </Select>
      </div>

      {/* Schedule Date & Time (Conditional) */}
      {/* {formData.productStatus === 'schedule' && (
        <div className="space-y-3">
          <div>
            <Label htmlFor="scheduleDate" className="text-sm font-medium text-slate-700 mb-2 block">
              Schedule Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  type="button"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-xl border-slate-200",
                    !formData.scheduleDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.scheduleDate ? format(new Date(formData.scheduleDate), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={formData.scheduleDate ? new Date(formData.scheduleDate) : undefined}
                  onSelect={(date) => date && handleInputChange('scheduleDate', date.toISOString())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="scheduleTime" className="text-sm font-medium text-slate-700 mb-2 block">
              Schedule Time
            </Label>
            <Input
              type="time"
              value={formData.scheduleTime}
              onChange={(e) => handleInputChange('scheduleTime', e.target.value)}
              className="rounded-xl border-slate-200"
            />
          </div>
        </div>
      )} */}
    </FormSection>
  );
}
