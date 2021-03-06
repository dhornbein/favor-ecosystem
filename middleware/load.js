/**
 * if the user is logged in load transaction and member data
 */
export default async function ({ $auth, store }) {
  
  if (!$auth.loggedIn) return;
  
  await Promise.all([
    store.dispatch('getAllTransactionsOnce'),
    store.dispatch('getAllMembersOnce')
  ]);
} 