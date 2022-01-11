export default async function ({ $auth, store }) {
  
  if (!$auth.loggedIn) return;
  
  console.log('fetching data...');
  await Promise.all([
    store.dispatch('getAllTransactionsOnce'),
    store.dispatch('getAllMembersOnce')
  ]);
} 