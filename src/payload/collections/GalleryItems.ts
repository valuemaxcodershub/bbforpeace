import type { Access, CollectionConfig } from 'payload'
import { sanitizeAdminDocumentData } from './shared/adminSanitizers'

const isEditorOrAbove: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'super-admin' || user.role === 'admin' || user.role === 'editor'
}

export const GalleryItems: CollectionConfig = {
  slug: 'gallery-items',
  labels: {
    singular: 'Gallery Item',
    plural: 'Gallery Items',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'mediaType', 'category', 'status', 'order'],
    description: 'Photo and video entries shown on the gallery page.',
    group: 'Media Page',
  },
  access: {
    read: () => true,
    create: isEditorOrAbove,
    update: isEditorOrAbove,
    delete: isEditorOrAbove,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data || typeof data !== 'object') return data
        return sanitizeAdminDocumentData(data as Record<string, unknown>, {
          relationFields: ['image'],
          conditionalRemovals: [
            {
              when: (nextData) => nextData.mediaType !== 'photo',
              fields: ['image'],
            },
            {
              when: (nextData) => nextData.mediaType !== 'video',
              fields: ['youtubeId'],
            },
          ],
        })
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'mediaType',
      type: 'select',
      required: true,
      defaultValue: 'photo',
      options: [
        { label: 'Photo', value: 'photo' },
        { label: 'Video', value: 'video' },
      ],
    },
    {
      name: 'category',
      type: 'text',
      required: true,
      defaultValue: 'Events',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.mediaType === 'photo',
        description: 'Required for photo items.',
      },
    },
    {
      name: 'youtubeId',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.mediaType === 'video',
        description: 'Required for video items. Example: xvQ_AXIQbPM',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}