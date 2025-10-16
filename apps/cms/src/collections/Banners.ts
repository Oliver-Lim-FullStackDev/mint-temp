import type { CollectionConfig } from 'payload'

export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: {
    singular: 'Banner',
    plural: 'Banners',
  },
  access: {
    // Public read access
    read: () => true,
    // Only logged-in users can create
    create: ({ req }) => !!req.user,
    // Only logged-in users can update
    update: ({ req }) => !!req.user,
    // Only logged-in users can delete
    delete: ({ req }) => !!req.user,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'section', 'type'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'actionButton',
      type: 'group',
      label: 'Action Button',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Button Label',
        },
        {
          name: 'url',
          type: 'text',
          label: 'Button URL',
        },
      ],
    },
    {
      name: 'background',
      type: 'upload',
      label: 'Background Image or Video',
      relationTo: 'media', // usa tu colección existente de Media
    },
    {
      name: 'section',
      type: 'select',
      label: 'Section to Appear',
      options: [
        { label: 'Home', value: 'home' },
        { label: 'Products', value: 'products' },
        { label: 'About', value: 'about' },
        { label: 'Contact', value: 'contact' },
      ],
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      label: 'Type of Banner',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Carousel', value: 'carousel' },
      ],
      required: true,
      defaultValue: 'standard',
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Published',
      defaultValue: true,
    },
  ],
}
