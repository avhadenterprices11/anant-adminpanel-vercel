import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderWithBreadcrumbProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  description?: string;
  actionButton?: React.ReactNode;
  showBackButton?: boolean;
}

export const PageHeaderWithBreadcrumb: React.FC<PageHeaderWithBreadcrumbProps> = ({
  title,
  breadcrumbs,
  description,
  actionButton,
  showBackButton = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {crumb.href && index < breadcrumbs.length - 1 ? (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full h-10 w-10 hover:bg-slate-100"
            >
              <ChevronLeft className="size-5 text-slate-500" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            {description && (
              <p className="text-sm text-slate-600 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {actionButton && <div>{actionButton}</div>}
      </div>
    </div>
  );
};