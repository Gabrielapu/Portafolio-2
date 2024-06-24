<template>
  <div
    class="relative table-wrapper rounded bg-white border-slate-200"
    :class="tableClassNames"
  >
    <div v-if="loading">
      <Spinner />
    </div>
    <div v-else-if="!data.length" class="text-center text-xl mt-5 font-thin p-1">
      No hay registros
    </div>
    <table 
      v-else 
      class="p-4 text-slate-500" 
      :class="{
        'w-full': !horizontalScroll,
        'w-[1550px]': horizontalScroll
      }"
    >
      <thead>
        <tr v-if="extraHeaders.length" class="bg-slate-100 border-b border-slate-200">
          <th
            v-for="extraHeader, i in extraHeaders"
            :key="i"
            class="py-2"
            rowspan="1"
            :colspan="extraHeader.colspan"
          >
            {{ extraHeader.text }}
          </th>
        </tr>
        <tr>
          <th
            v-for="(header, i) in tableHeaders"
            :key="i"
            class="box-content border-b border-slate-200 py-2"
            :class="{
              'w-52': header.text === 'Acciones',
              'w-auto': header.text !== 'Acciones',
              'last:sticky last:right-0 last:bg-white': horizontalScroll && stickyRight,
            }"
          >
            <div>
              <p class="text-slate-500 text-xs">{{ header.text }}</p>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(row, i) in data" :key="i" 
          :class="{ 'bg-slate-50': i % 2 === 0 }"
        >
          <td
            v-for="(cell, j) in tableHeaders"
            :key="j"
            :class="{
              'w-52': cell.text === 'Acciones',
              'w-auto': cell.text !== 'Acciones',
              'last:sticky last:right-0': horizontalScroll && stickyRight,
              'last:bg-slate-50': i % 2 === 0,
              'last:bg-white': i % 2 !== 0
            }"
          >              
            <div
              v-if="cell.value === 'actions'"
              class="p-4 flex flex-row items-center justify-center"
            >
              <slot name="more_actions" :item="row"></slot>
              <Button
                v-if="!hideEditButton"
                size="sm"
                color="default"
                :label="editButtonOptions.text"
                uppercase
                :icon="editButtonOptions.icon"
                class="mr-1"
                :link="editLink ? `/${editLink}/${row.id}` : null"
                @click.native="editLink ? '' : emit('toogleEditModal', row)"
              />
              <Button
                v-if="!hideDuplicateButton"
                size="sm"
                color="default"
                label="DUPLICAR"
                icon="uil:copy"
                class="mr-1"
                @click.native="emit('toogleDuplicateModal', row)"
              />
              <Button
                v-if="!hideDeleteButton"
                size="sm"
                color="danger"
                outlined
                label="ELIMINAR"
                icon="uil:trash"
                @click="emit('toogleDeleteModal', row)"
              />
            </div>
            <div v-else class="p-2 full-center">
              <slot :name="cell.value" :item="row">
                <div class="mx-2 text-sm">
                  {{ getCellValue(cell.value, row) }}
                </div>
              </slot>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination
    v-if="paginated"
    :items-per-page="itemsPerPage"
    :items-amount="itemsAmount"
    :current-page="currentPage"
    @change-page="changePage"
  />
</template>

<script setup>

const props = defineProps({
  data: { type: Array, default: () => [] },
  rowNums: { type: Boolean, default: false },
  headers: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  noBorder: { type: Boolean, default: false },
  editLink: { type: String, default: '' },
  paginated: { type: Boolean, default: false },
  tableTitle: { type: String, default: '' },
  fitContent: { type: Boolean, default: false },
  stickyRight: { type: Boolean, default: false },
  itemsAmount: { type: Number, default: 0 },
  currentPage: { type: Number, default: 0 },
  itemsPerPage: { type: Number, default: 8 },
  extraHeaders: { type: Array, default: () => [] },
  hideEditButton: { type: Boolean, default: false },
  hideDeleteButton: { type: Boolean, default: false },
  horizontalScroll: { type: Boolean, default: false },
  editButtonOptions: { type: Object, default: { icon: 'uil:edit', text: 'editar'} },
  hideDuplicateButton: { type: Boolean, default: false },
})

const emit = defineEmits([
  'changePage',
  'toogleDuplicateModal', 
  'toogleDeleteModal', 
  'toogleEditModal'
])

const tableHeaders = computed(() => {
  const headerList = []
  if (props.rowNums) headerList.push({})
  props.headers.forEach((header) => {
    headerList.push(header)
  })
  return headerList
})

const tableClassNames = computed(() => {
  return {
    'border': !props.noBorder,
    'shadow-sm': !props.noBorder,
    'overflow-x-scroll': props.horizontalScroll,
    'min-h-min': props.fitContent,
    'min-h-[576px]': !props.fitContent
  }
})

const getCellValue = (cell, row) => {
  let value
  for (const key in row) {
    if (cell === key) {
      value = row[key]
      break
    }
  }
  return value
}

const changePage = (page) => {
  emit('changePage', page)
}
</script>