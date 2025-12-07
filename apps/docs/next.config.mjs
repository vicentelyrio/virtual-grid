import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  defaultShowCopyCode: true
})

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'

export default withNextra({
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: isGitHubPages ? '/virtual-grid' : '',
  assetPrefix: isGitHubPages ? '/virtual-grid' : '',
})
