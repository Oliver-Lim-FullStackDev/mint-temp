import type { CollectionConfig } from 'payload'

export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: {
    singular: 'Banner',
    plural: 'Banners',
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'section', 'type'],
  },
  fields: [
    // SECTION
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

    // TYPE
    {
      name: 'type',
      type: 'select',
      label: 'Type of Banner',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Carousel', value: 'carousel' },
      ],
      required: true,
    },

    // FIELDS FOR IMAGE OR VIDEO TYPE
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Banner Title',
      admin: {
        condition: (_, siblingData) => siblingData.type === 'image' || siblingData.type === 'video',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Banner Subtitle',
      admin: {
        condition: (_, siblingData) => siblingData.type === 'image' || siblingData.type === 'video',
      },
    },

    // IMAGE
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
      admin: { condition: (_, siblingData) => siblingData.type === 'image' },
    },

    // VIDEO
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      label: 'Video',
      admin: { condition: (_, siblingData) => siblingData.type === 'video' },
    },

    // TAGS FOR IMAGE OR VIDEO BANNERS
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [{ name: 'tag', type: 'text' }],
      admin: {
        condition: (_, siblingData) => siblingData.type === 'image' || siblingData.type === 'video',
      },
    },

    // ACTION BUTTON FOR IMAGE OR VIDEO BANNERS
    {
      name: 'actionButton',
      type: 'group',
      label: 'Action Button',
      fields: [
        { name: 'label', type: 'text', label: 'Button Label' },
        { name: 'url', type: 'text', label: 'Button URL' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData.type === 'image' || siblingData.type === 'video',
      },
    },

    // CAROUSEL
    {
      name: 'carousel',
      type: 'blocks',
      admin: { condition: (_, siblingData) => siblingData.type === 'carousel' },
      blocks: [
        {
          slug: 'slide',
          labels: { singular: 'Slide', plural: 'Slides' },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Slide Title',
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Slide Subtitle',
            },
            {
              name: 'tags',
              type: 'array',
              label: 'Tags',
              fields: [{ name: 'tag', type: 'text' }],
            },
            {
              name: 'actionButton',
              type: 'group',
              label: 'Action Button',
              fields: [
                { name: 'label', type: 'text', label: 'Button Label' },
                { name: 'url', type: 'text', label: 'Button URL' },
              ],
            },
            {
              name: 'slideType',
              type: 'select',
              label: 'Slide Type',
              options: [
                { label: 'Image', value: 'image' },
                { label: 'Video', value: 'video' },
              ],
              required: true,
            },
            {
              name: 'slideImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Slide Image',
              admin: { condition: (_, siblingData) => siblingData.slideType === 'image' },
            },
            {
              name: 'slideVideo',
              type: 'upload',
              relationTo: 'media',
              label: 'Slide Video',
              admin: { condition: (_, siblingData) => siblingData.slideType === 'video' },
            },
          ],
        },
      ],
    },

    // PUBLISHED
    {
      name: 'published',
      type: 'checkbox',
      label: 'Published',
      defaultValue: true,
    },
  ],
}
