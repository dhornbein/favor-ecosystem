<template>
  <table class="trans-table table-auto max-w-3xl w-full" v-if="filtered">
    <thead>
      <tr>
        <th v-for="title in Object.keys(filtered[0])" :key="title" :class="title">{{ title }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row) in filtered" :key="row.ID" :id="`row-${row.ID}`" :title="row.timestamp"
        class="odd:bg-gray-100"
      >
        <td v-for="(cell, col) in row" :key="row.ID + '-' + col"
          :class="col"
        >
          <details v-if="col == 'title' && row.description">
            <summary>{{ cell }}</summary>
            <p>{{ row.description }}</p>
          </details>
          <span v-else-if="col == 'amount' || col == 'fee'">{{ cell | favor }}</span>
          <span v-else>{{ cell }}</span>
          
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    trans: {
      type: Array,
      required: true
    },
    showCols: {
      type: Array,
      default: false
    }
  },
  computed: {
    filtered() {
      return this.trans.map(row => {
        return Object.keys(row)
        .filter(key => this.showCols.includes(key))
        .reduce((obj, key) => {
          obj[key] = row[key];
          return obj;
        }, {});
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.trans-table {
  @apply bg-white p-5 mx-auto;

  tr {

    th {
      @apply p-4;
    }
    td {
      @apply p-4;

      &.amount,
      &.fee {
        @apply text-right font-mono;
      }
      &.fee {
        @apply text-gray-600;
      }
    }
  }

  .description {
    @apply hidden;
  }
}
</style>