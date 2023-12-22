import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally 注册SVG组件
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
