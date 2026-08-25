
'use client';

import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminEditBlogForm from '@/components/AdminEditBlogForm';

export default function EditBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  return (
    <AdminLayout>
      <AdminEditBlogForm slug={slug} />
    </AdminLayout>
  );
}
