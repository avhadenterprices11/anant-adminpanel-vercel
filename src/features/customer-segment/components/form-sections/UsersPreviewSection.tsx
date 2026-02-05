import { Users, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { UsersPreviewSectionProps } from '../../types/segment.types';

export const UsersPreviewSection = ({ matchingUsers, hasValidRule, applied = false }: UsersPreviewSectionProps) => {
  if (!hasValidRule || !applied) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Matching Users Preview</h2>
          <p className="text-sm text-slate-600 mt-1">Users that match the current segment rules</p>
        </div>
        <Badge variant="default" className="bg-indigo-100 text-indigo-700 border-indigo-200">
          <Users className="size-3 mr-1" />
          {matchingUsers.length} users
        </Badge>
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matchingUsers.length > 0 ? (
              matchingUsers.slice(0, 5).map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-slate-600">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                  No matching users found. Adjust your segment rules.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {matchingUsers.length > 5 && (
        <div className="text-center">
          <Button variant="outline" size="sm">
            <Eye className="size-4 mr-2" />
            View All {matchingUsers.length} Users
          </Button>
        </div>
      )}

      <p className="text-xs text-slate-500 mt-2">
        This preview updates automatically based on your conditions
      </p>
    </div>
  );
};
