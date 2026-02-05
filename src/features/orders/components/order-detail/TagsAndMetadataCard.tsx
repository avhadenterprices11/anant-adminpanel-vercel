import { Tag as TagIcon, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface TagsAndMetadataCardProps {
  tags?: string[];
  salesChannel: string;
  createdOn: string;
  lastModified: string;
  orderId: string;
}

export function TagsAndMetadataCard({
  tags = [],
  salesChannel,
  createdOn,
  lastModified,
  orderId,
}: TagsAndMetadataCardProps) {
  return (
    <Card className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
      {/* Tags Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TagIcon className="size-5 text-icon-muted" />
          <h3 className="font-semibold text-slate-900">Tags</h3>
        </div>

        {tags && tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-slate-100 text-slate-700 font-medium border-slate-200"
              >
                {tag}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm text-slate-400 italic">No tags added</p>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100" />

      {/* Additional Data Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Settings className="size-5 text-icon-muted" />
          <h3 className="font-semibold text-slate-900">
            Additional Data
          </h3>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs text-slate-600">Sales Channel</p>
            <Badge variant="secondary" className="mt-1">
              {salesChannel}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-slate-600">Created On</p>
            <p className="font-medium text-slate-900">
              {format(new Date(createdOn), "dd MMM, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Modified</p>
            <p className="font-medium text-slate-900">
              {format(new Date(lastModified), "dd MMM, yyyy h:mm a")}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Order ID</p>
            <p className="font-mono text-[10px] text-slate-400 uppercase tracking-wide">
              {orderId}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
