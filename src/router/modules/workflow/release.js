const release = [{
  name: 'systemRelease',
  meta: {
    title: '发版',
    requireAuth: true
  },
  path: '/workflow/smartForm/release/systemRelease',
  component: () => import('@/views/workflow/smartForm/release/systemRelease')
}]

export default release;