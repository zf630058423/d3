import admin from './admin/index.js'
import fullDevelopment from './fullDevelopment/index.js'
import workflow from './workflow/index.js'
import views from './views/index.js'
const modules = [
  ...admin,
  ...fullDevelopment,
  ...workflow,
  ...views
]
export default modules
