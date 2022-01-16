export default async function ({ $auth, route, redirect }) {

  if (!$auth.loggedIn) return;

  if (route.path === `/members/${$auth.user.username}`) {
    redirect({ path: '/'})
  }
} 