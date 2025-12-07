import nextra from 'nextra'

const basePath = process.env.BASE_PATH || ''

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  defaultShowCopyCode: true
})

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  ...(basePath && {
    basePath: basePath,
    assetPrefix: basePath,
  }),
}

export default withNextra(nextConfig)
