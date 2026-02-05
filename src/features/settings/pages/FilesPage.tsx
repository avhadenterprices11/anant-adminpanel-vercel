import React from 'react';
import { 
  ChevronRight, 
  ArrowLeft, 
  Save, 
  Folder,
  Upload,
  Image,
  FileText,
  Video,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';

const FilesPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/settings');
  };

  const recentFiles = [
    { id: 1, name: 'product-banner.jpg', type: 'image', size: '2.4 MB', date: '2024-12-20' },
    { id: 2, name: 'catalog-2024.pdf', type: 'document', size: '8.1 MB', date: '2024-12-18' },
    { id: 3, name: 'promotional-video.mp4', type: 'video', size: '45.2 MB', date: '2024-12-15' },
    { id: 4, name: 'logo-dark.png', type: 'image', size: '156 KB', date: '2024-12-10' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative animate-in fade-in duration-500">
      {/* Fixed Top Header */}
      <header className="flex-none flex items-center justify-between px-4 sm:px-6 py-4 bg-white border-b border-slate-200 z-10 sticky top-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <button onClick={handleBack} className="hover:text-slate-800 transition-colors hover:underline">Settings</button>
            <ChevronRight className="size-4" />
            <span className="font-medium text-slate-900">Files</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8 -ml-2 lg:hidden">
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Files</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleBack} className="text-slate-600 hover:text-slate-900">
            Cancel
          </Button>
          <Button className="bg-[#2e1065] hover:bg-[#2e1065]/90 text-white shadow-sm gap-2">
            <Save size={16} /> Save Changes
          </Button>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="space-y-6">
          
          {/* SECTION 1 — Storage Overview */}
          <Card className="border-slate-200 shadow-sm rounded-[16px] overflow-hidden bg-white">
            <CardHeader className="bg-white px-6 py-5 border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Folder className="size-5 text-[#2e1065]" />
                Storage Overview
              </CardTitle>
              <CardDescription>Manage your file storage and uploads.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-sm text-slate-500 mb-1">Used Storage</p>
                  <p className="text-2xl font-bold text-[#2e1065]">2.4 GB</p>
                  <p className="text-xs text-slate-400">of 10 GB</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-500 mb-1">Total Files</p>
                  <p className="text-2xl font-bold text-slate-900">1,247</p>
                  <p className="text-xs text-slate-400">files uploaded</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-500 mb-1">This Month</p>
                  <p className="text-2xl font-bold text-slate-900">89</p>
                  <p className="text-xs text-slate-400">new uploads</p>
                </div>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-[#2e1065] h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 2 — Upload Settings */}
          <Card className="border-slate-200 shadow-sm rounded-[16px] overflow-hidden bg-white">
            <CardHeader className="bg-white px-6 py-5 border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Upload className="size-5 text-[#2e1065]" />
                Upload Settings
              </CardTitle>
              <CardDescription>Configure file upload preferences.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Max File Size</Label>
                  <Select defaultValue="50">
                    <SelectTrigger className="bg-slate-50/50 focus:bg-white transition-colors"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 MB</SelectItem>
                      <SelectItem value="25">25 MB</SelectItem>
                      <SelectItem value="50">50 MB</SelectItem>
                      <SelectItem value="100">100 MB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Image Quality</Label>
                  <Select defaultValue="high">
                    <SelectTrigger className="bg-slate-50/50 focus:bg-white transition-colors"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">Original</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between border border-slate-100 p-4 rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Auto-optimize images</Label>
                    <p className="text-xs text-slate-500">Compress on upload</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between border border-slate-100 p-4 rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Generate thumbnails</Label>
                    <p className="text-xs text-slate-500">Auto-create previews</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between border border-slate-100 p-4 rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Allow video uploads</Label>
                    <p className="text-xs text-slate-500">MP4, WebM formats</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between border border-slate-100 p-4 rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Allow documents</Label>
                    <p className="text-xs text-slate-500">PDF, DOC formats</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3 — Recent Files */}
          <Card className="border-slate-200 shadow-sm rounded-[16px] overflow-hidden bg-white">
            <CardHeader className="bg-white px-6 py-5 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Recent Files</CardTitle>
                <CardDescription>Recently uploaded files.</CardDescription>
              </div>
              <Button size="sm" variant="outline">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {recentFiles.map((file) => (
                  <div key={file.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-purple-50 rounded-lg flex items-center justify-center">
                        {file.type === 'image' && <Image className="text-[#2e1065]" size={18} />}
                        {file.type === 'document' && <FileText className="text-[#2e1065]" size={18} />}
                        {file.type === 'video' && <Video className="text-[#2e1065]" size={18} />}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{file.name}</p>
                        <p className="text-xs text-slate-500">{file.size} • {file.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">{file.type}</Badge>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 sm:left-[280px] right-0 p-4 bg-white border-t border-slate-200 z-50 flex items-center justify-between md:justify-end gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <span className="text-sm text-slate-500 hidden md:block mr-auto">
          File settings affect all new uploads.
        </span>
        <Button variant="ghost" onClick={handleBack} className="flex-1 md:flex-none text-slate-600 hover:text-slate-900">
          Cancel
        </Button>
        <Button className="flex-1 md:flex-none bg-[#2e1065] hover:bg-[#2e1065]/90 text-white min-w-[140px] shadow-md">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default FilesPage;
