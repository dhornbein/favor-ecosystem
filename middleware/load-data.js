export default async function ({ store }) {
  await Promise.all([
    store.dispatch('getAllTransactionsOnce'),
    store.dispatch('getAllMembersOnce')
  ]);
} 