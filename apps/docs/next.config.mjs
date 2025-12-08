import nextra from 'nextra'

const basePath = process.env.BASE_PATH || ''

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  defaultShowCopyCode: true
})

const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
  experimental: {
    typedRoutes: true,
  },
  images: {
    unoptimized: true
  },
  ...(basePath && {
    basePath,
    assetPrefix: basePath,
  }),
}

export default withNextra(nextConfig)
