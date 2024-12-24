export default {
  logo: <span>Virtual Grid</span>,
  project: {
    link: 'https://github.com/vicentelyrio/virtual-grid'
  },
  docsRepositoryBase: 'https://github.com/vicentelyrio/virtual-grid/tree/main/apps/docs',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Virtual Grid'
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
