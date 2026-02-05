import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import {
  FolderOpen,
  FileText,
  Image,
  Save,
  Upload,
  X,
  Plus,
  Settings,
  Eye,
  Calendar,
  Link as LinkIcon,
  Filter,
  ChevronLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { logger } from "@/utils/logger";

// Components
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CollectionData {
  // Basic Collection Details
  collectionTitle: string;
  urlHandle: string;
  description: string;
  collectionType: 'manual' | 'automated';
  collectionTags: string[];
  collectionStatus: 'active' | 'draft' | 'archived';

  // Collection Rules (Conditional)
  collectionRules: string[];
  ruleMatchType: 'all' | 'any';

  // Sorting & Publish Control
  productSortOrder: 'manual' | 'best-selling' | 'alphabetical' | 'price-low-high' | 'price-high-low' | 'newest';
  published: boolean;
  publishDate: string;

  // Media Assets
  desktopImage: string;
  mobileImage: string;

  // SEO Metadata
  metaTitle: string;
  metaDescription: string;
}

export default function CollectionDetailPage() {
  const navigate = useNavigate();
  const [newTag, setNewTag] = useState('');
  const [newRule, setNewRule] = useState('');

  // Form state - Using Siscaa's default values as requested
  const [formData, setFormData] = useState<CollectionData>({
    // Basic Collection Details
    collectionTitle: 'Cricket Equipment Collection',
    urlHandle: 'cricket-equipment-collection',
    description: 'Complete range of cricket gear including bats, balls, protective equipment, and accessories for players of all skill levels.',
    collectionType: 'manual',
    collectionTags: ['Cricket', 'Sports Equipment', 'Featured'],
    collectionStatus: 'active',

    // Collection Rules
    collectionRules: [],
    ruleMatchType: 'all',

    // Sorting & Publish Control
    productSortOrder: 'best-selling',
    published: true,
    publishDate: '2024-01-15',

    // Media Assets
    desktopImage: '',
    mobileImage: '',

    // SEO Metadata
    metaTitle: 'Premium Cricket Equipment',
    metaDescription: 'Shop the best cricket equipment collection featuring professional bats, balls, protective gear, and accessories. Quality guaranteed.',
  });

  const [originalData] = useState<CollectionData>({ ...formData });

  const handleInputChange = (field: keyof CollectionData, value: CollectionData[keyof CollectionData]) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Auto-fill SEO fields from title
    if (field === 'collectionTitle') {
      // Auto-generate URL handle from title
      const titleString = typeof value === 'string' ? value : String(value);
      const handle = titleString.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, urlHandle: handle }));

      // Auto-fill meta title
      setFormData(prev => ({ ...prev, metaTitle: titleString }));
    }

    // Auto-fill meta description from description
    if (field === 'description') {
      const descString = typeof value === 'string' ? value : String(value);
      setFormData(prev => ({ ...prev, metaDescription: descString }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.collectionTags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        collectionTags: [...prev.collectionTags, newTag.trim()]
      }));
      setNewTag('');
      toast.success('Tag added');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      collectionTags: prev.collectionTags.filter(t => t !== tag)
    }));
    toast.success('Tag removed');
  };

  const handleAddRule = () => {
    if (newRule.trim() && !formData.collectionRules.includes(newRule.trim())) {
      setFormData(prev => ({
        ...prev,
        collectionRules: [...prev.collectionRules, newRule.trim()]
      }));
      setNewRule('');
      toast.success('Rule added');
    }
  };

  const handleRemoveRule = (rule: string) => {
    setFormData(prev => ({
      ...prev,
      collectionRules: prev.collectionRules.filter(r => r !== rule)
    }));
    toast.success('Rule removed');
  };

  const handleSave = () => {
    logger.info('Saving collection data:', formData);
    toast.success('Collection saved successfully!', {
      description: 'All changes have been updated.',
    });
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    toast.info('Changes discarded');
  };

  const handleUploadImage = (type: 'desktop' | 'mobile') => {
    toast.info(`${type === 'desktop' ? 'Desktop' : 'Mobile'} image upload`, {
      description: 'Connect to your image upload service',
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'draft': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'archived': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex-1 w-full custom-scrollbar-light">
      {/* Sticky Header Section - Pinned below the main header (80px) */}
      <div id="collection-detail-sticky-header" className="sticky top-0 z-20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200 shadow-sm -mx-1 px-7 lg:px-9 py-4 mb-6 transition-all">
        <div className="space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate(ROUTES.COLLECTIONS.LIST)}
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              Collections
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-medium">{formData.collectionTitle}</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(ROUTES.COLLECTIONS.LIST)}
                className="rounded-full h-10 w-10 hover:bg-slate-100"
              >
                <ChevronLeft className="size-5 text-slate-500" />
              </Button>
              <div>
                <h1 className="text-slate-900 mb-1">Collection Details</h1>
                <p className="text-sm text-slate-600">
                  Manage collection information, products, and settings
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleCancel}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                size="lg"
                onClick={handleSave}
                className="rounded-xl bg-[#0e042f] hover:bg-[#0e042f]/90"
              >
                <Save className="size-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-8 pb-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* SECTION: Basic Collection Details */}
            <div className="bg-white rounded-[20px] border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <FolderOpen className="size-5 text-gray-400" />
                  <h2 className="font-semibold text-slate-900">Basic Collection Details</h2>
                </div>

              </div>

              <div className="space-y-4">
                {/* Collection Title */}
                <div>
                  <Label htmlFor="collectionTitle" className="text-sm font-medium text-slate-700 mb-2 block">
                    Collection Title *
                  </Label>
                  <Input
                    id="collectionTitle"
                    value={formData.collectionTitle}
                    onChange={(e) => handleInputChange('collectionTitle', e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                {/* URL Handle */}
                <div>
                  <Label htmlFor="urlHandle" className="text-sm font-medium text-slate-700 mb-2 block">
                    URL Handle / Slug *
                  </Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      id="urlHandle"
                      value={formData.urlHandle}
                      onChange={(e) => handleInputChange('urlHandle', e.target.value)}
                      className="pl-9 rounded-xl"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">
                    Used in the collection URL: /collections/{formData.urlHandle}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-slate-700 mb-2 block">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}

                    rows={4}
                    className={`rounded-xl resize-none $`}
                    placeholder="Describe this collection..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Collection Type */}
                  <div>
                    <Label htmlFor="collectionType" className="text-sm font-medium text-slate-700 mb-2 block">
                      Collection Type *
                    </Label>
                    <Select
                      value={formData.collectionType}
                      onValueChange={(value) => {
                        handleInputChange('collectionType', value as any);
                        if (value === 'manual') {
                          setFormData(prev => ({ ...prev, collectionRules: [] }));
                        }
                      }}

                    >
                      <SelectTrigger id="collectionType" className={`rounded-xl $`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automated">Automated</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500 mt-1.5">
                      {formData.collectionType === 'manual'
                        ? 'Add products manually'
                        : 'Products added automatically based on rules'}
                    </p>
                  </div>

                  {/* Collection Status */}
                  <div>
                    <Label htmlFor="collectionStatus" className="text-sm font-medium text-slate-700 mb-2 block">
                      Collection Status *
                    </Label>
                    <Select
                      value={formData.collectionStatus}
                      onValueChange={(value) => handleInputChange('collectionStatus', value as any)}

                    >
                      <SelectTrigger id="collectionStatus" className={`rounded-xl $`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Collection Tags */}
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">
                    Collection Tags
                  </Label>
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[60px]">
                    {formData.collectionTags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="rounded-lg h-7">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 hover:text-red-600 transition-colors"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Add new tag..."
                      className="rounded-lg flex-1"
                    />
                    <Button
                      onClick={handleAddTag}
                      variant="outline"
                      size="sm"
                      className="rounded-lg"
                    >
                      <Plus className="size-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  {/* Suggested Tags */}
                  <div className="space-y-2 mt-3">
                    <Label className="text-xs text-slate-600">Suggested Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Cricket', 'Featured', 'New Arrival', 'Best Seller', 'Sale', 'Premium', 'Professional', 'Beginner']
                        .filter(suggestedTag => !formData.collectionTags.includes(suggestedTag))
                        .map(suggestedTag => (
                          <button
                            key={suggestedTag}
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                collectionTags: [...prev.collectionTags, suggestedTag]
                              }));
                            }}
                            className="text-xs px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 border border-slate-200 transition-colors"
                          >
                            + {suggestedTag}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION: Collection Rules (Conditional - Only if Automated) */}
            {formData.collectionType === 'automated' && (
              <div className="bg-white rounded-[20px] border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Filter className="size-5 text-gray-400" />
                    <h2 className="font-semibold text-slate-900">Collection Rules</h2>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                    Automated Only
                  </Badge>
                </div>

                <div className="space-y-4">
                  {/* Rule Match Type */}
                  <div>
                    <Label htmlFor="ruleMatchType" className="text-sm font-medium text-slate-700 mb-2 block">
                      Rule Match Type *
                    </Label>
                    <Select
                      value={formData.ruleMatchType}
                      onValueChange={(value) => handleInputChange('ruleMatchType', value as any)}

                    >
                      <SelectTrigger id="ruleMatchType" className={`rounded-xl $`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">Match All Rules (AND)</SelectItem>
                        <SelectItem value="any">Match Any Rule (OR)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500 mt-1.5">
                      {formData.ruleMatchType === 'all'
                        ? 'Products must match all conditions'
                        : 'Products must match at least one condition'}
                    </p>
                  </div>

                  {/* Collection Rules */}
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">
                      Rules
                    </Label>
                    <div className="space-y-2">
                      {formData.collectionRules.length > 0 ? (
                        formData.collectionRules.map((rule, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="text-sm text-slate-700">{rule}</span>
                            <button
                              onClick={() => handleRemoveRule(rule)}
                              className="text-slate-400 hover:text-red-600 transition-colors"
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
                          <p className="text-sm text-slate-500">No rules defined yet</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newRule}
                        onChange={(e) => setNewRule(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddRule()}
                        placeholder="e.g., Product tag equals 'Cricket'"
                        className="rounded-lg flex-1"
                      />
                      <Button
                        onClick={handleAddRule}
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                      >
                        <Plus className="size-4 mr-1" />
                        Add Rule
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION: Sorting & Publish Control */}
            <div className="bg-white rounded-[20px] border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Settings className="size-5 text-gray-400" />
                  <h2 className="font-semibold text-slate-900">Sorting & Publish Control</h2>
                </div>
              </div>

              <div className="space-y-4">
                {/* Product Sort Order */}
                <div>
                  <Label htmlFor="productSortOrder" className="text-sm font-medium text-slate-700 mb-2 block">
                    Product Sort Order
                  </Label>
                  <Select
                    value={formData.productSortOrder}
                    onValueChange={(value) => handleInputChange('productSortOrder', value as any)}

                  >
                    <SelectTrigger id="productSortOrder" className={`rounded-xl $`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="best-selling">Best Selling</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical (A-Z)</SelectItem>
                      <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                      <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500 mt-1.5">
                    How products are sorted in this collection
                  </p>
                </div>

                {/* Published Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div>
                    <Label htmlFor="published" className="text-sm font-medium text-slate-900">
                      Published
                    </Label>
                    <p className="text-xs text-slate-500 mt-1">
                      Make this collection visible to customers
                    </p>
                  </div>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => handleInputChange('published', checked)}

                  />
                </div>

                {/* Publish Date (Conditional) */}
                {formData.published && (
                  <div>
                    <Label htmlFor="publishDate" className="text-sm font-medium text-slate-700 mb-2 block">
                      Publish Date
                    </Label>
                    <div className="relative">
                      <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 $'text-gray-400'`} />
                      <Input
                        id="publishDate"
                        type="date"
                        value={formData.publishDate}
                        onChange={(e) => handleInputChange('publishDate', e.target.value)}

                        className={`pl-9 rounded-xl $`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION: SEO Metadata */}
            <div className="bg-white rounded-[20px] border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <FileText className="size-5 text-gray-400" />
                  <h2 className="font-semibold text-slate-900">SEO Metadata</h2>
                </div>
              </div>

              <div className="space-y-4">
                {/* Meta Title */}
                <div>
                  <Label htmlFor="metaTitle" className="text-sm font-medium text-slate-700 mb-2 block">
                    Meta Title
                  </Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}

                    className={`rounded-xl $`}
                    placeholder="Collection meta title for search engines"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">
                    {formData.metaTitle.length}/60 characters recommended
                  </p>
                </div>

                {/* Meta Description */}
                <div>
                  <Label htmlFor="metaDescription" className="text-sm font-medium text-slate-700 mb-2 block">
                    Meta Description
                  </Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}

                    rows={3}
                    className={`rounded-xl resize-none $`}
                    placeholder="Collection meta description for search engines"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">
                    {formData.metaDescription.length}/160 characters recommended
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Media & Status */}
          <div className="space-y-6">

            {/* SECTION: Collection Status Card */}
            <div className="bg-white rounded-[20px] border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Eye className="size-5 text-gray-400" />
                <h2 className="font-semibold text-slate-900">Status</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-slate-500 mb-2 block">
                    Current Status
                  </Label>
                  <Badge className={`${getStatusBadgeColor(formData.collectionStatus)} text-sm px-3 py-1`}>
                    {formData.collectionStatus.charAt(0).toUpperCase() + formData.collectionStatus.slice(1)}
                  </Badge>
                </div>

                <div className="h-px bg-slate-200" />

                <div>
                  <Label className="text-xs font-medium text-slate-500 mb-1 block">
                    Visibility
                  </Label>
                  <div className="text-sm font-medium text-slate-900">
                    {formData.published ? 'Published' : 'Not Published'}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium text-slate-500 mb-1 block">
                    Collection Type
                  </Label>
                  <div className="text-sm font-medium text-slate-900">
                    {formData.collectionType.charAt(0).toUpperCase() + formData.collectionType.slice(1)}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION: Media Assets */}
            <div className="bg-white rounded-[20px] border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Image className="size-5 text-gray-400" />
                <h2 className="font-semibold text-slate-900">Media Assets</h2>
              </div>

              <div className="space-y-4">
                {/* Desktop Image */}
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">
                    Collection Image (Desktop)
                  </Label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
                    {formData.desktopImage ? (
                      <div className="space-y-3">
                        <div className="aspect-video bg-slate-100 rounded-lg" />
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg w-full"
                          onClick={() => handleUploadImage('desktop')}
                        >
                          <Upload className="size-3.5 mr-2" />
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Image className="size-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-sm text-slate-600 mb-3">No image uploaded</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => handleUploadImage('desktop')}
                        >
                          <Upload className="size-3.5 mr-2" />
                          Upload Image
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">
                    Recommended: 1920x1080px
                  </p>
                </div>

                {/* Mobile Image */}
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">
                    Collection Image (Mobile)
                  </Label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
                    {formData.mobileImage ? (
                      <div className="space-y-3">
                        <div className="aspect-square bg-slate-100 rounded-lg" />
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg w-full"
                          onClick={() => handleUploadImage('mobile')}
                        >
                          <Upload className="size-3.5 mr-2" />
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Image className="size-12 mx-auto text-slate-300 mb-3" />
                        <p className="text-sm text-slate-600 mb-3">No image uploaded</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => handleUploadImage('mobile')}
                        >
                          <Upload className="size-3.5 mr-2" />
                          Upload Image
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">
                    Recommended: 1080x1080px
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
