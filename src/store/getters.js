const getters = {
  tagsView: state => state.app.tagsView,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userId: state => state.user.userId,
  author: state => state.user.author,
  homeAuth: state => state.user.homeAuth,
  userInfo: state => state.user.userInfo,
}
// demo:
export default getters
