import { lazy } from "react";
import { Route } from "react-router-dom";
import { ProtectedLayout } from "@/layouts/ProtectedLayout";

// Lazy load blog pages
const BlogListPage = lazy(() => import("@/features/blogs/pages/BlogListPage"));
const BlogDetailPage = lazy(() => import("@/features/blogs/pages/BlogDetailPage"));
const AddBlogPage = lazy(() => import("@/features/blogs/pages/AddBlogPage"));

export const blogRoutes = (
  <>
    <Route path="/blogs" element={<ProtectedLayout><BlogListPage /></ProtectedLayout>} />
    <Route path="/blogs/:id" element={<ProtectedLayout><BlogDetailPage /></ProtectedLayout>} />
    <Route path="/blogs/add" element={<ProtectedLayout><AddBlogPage /></ProtectedLayout>} />
  </>
);