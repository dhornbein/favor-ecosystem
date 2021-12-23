export default async function ({ store }) {
  await store.dispatch('getAllTransactionsOnce'),
  await store.dispatch('getAllMembersOnce')
} 