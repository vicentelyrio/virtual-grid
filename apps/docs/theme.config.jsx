import React from 'react'

export default {
  title: 'Virtual Grid',
  logo: <span>Virtual Grid</span>,
  project: {
    link: 'https://github.com/vicentelyrio/virtual-grid'
  },
  docsRepositoryBase: 'https://github.com/vicentelyrio/virtual-grid/tree/main/apps/docs',
  head: (
    <>
      <title>Virtual Grid</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Virtual Grid" />
      <meta property="og:description" content="A React hook-based library for efficient grid virtualization" />
      <meta name="description" content="A React hook-based library for efficient grid virtualization" />
    </>
  ),
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Virtual Grid',
      defaultTitle: 'Virtual Grid',
      description: 'A React hook-based library for efficient grid virtualization'
    }
  },
  navigation: {
    prev: true,
   next: true
  },
  footer: {
    text: `MIT ${new Date().getFullYear()} © Virtual Grid.`
  }
}
