export default async function({ $auth, redirect }) {
  const user = $auth.user
  if(user && user.roles.includes('broker')) {
    // okay to pass
  } else {
    redirect('/')
  }
}