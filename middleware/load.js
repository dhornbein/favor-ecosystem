export default async function ({ $auth, store }) {
  
  if (!$auth.loggedIn) return;
  
  await Promise.all([
    store.dispatch('getAllTransactionsOnce'),
    store.dispatch('getAllMembersOnce')
  ]);
} 