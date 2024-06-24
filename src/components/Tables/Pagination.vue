<template>
  <div class="flex justify-center my-2">
    <div class="button-group w-fit flex border rounded overflow-clip bg-white border-slate-200 shadow-sm">
      <button
        :disabled="previousDisabled"
        class="full-center"
        :class="previousDisabled ? arrowButtonVariants.disabled : arrowButtonVariants.default"
        @click="previousPage"
      >
        <BaseIcon name="uil:arrow-left" />
        ATRÁS
      </button>
      <button
        v-for="num in visiblePageNumbers"
        :key="num"
        class="px-4 py-2 transition-all duration-75 full-center"
        :class="paginationNumButtonClassNames(num)"
        @click="numPage(num)"
      >
        {{ num }}
      </button>
      <button
        :disabled="nextDisabled"
        class="full-center"
        :class="nextDisabled ? arrowButtonVariants.disabled : arrowButtonVariants.default"
        @click="nextPage"
      >
        SIGUIENTE
        <BaseIcon name="uil:arrow-right" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    itemsPerPage: { type: Number, default: 0 },
    itemsAmount: { type: Number, default: 0 },
    currentPage: { type: Number, default: 0 },
    visiblePageRange: { type: Number, default: 10 },
  },
  data() {
    return {
      variants: {
        default:
          'text-slate-600 fill-slate-600 hover:text-white hover:fill-white hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-600',
        current: 'text-white fill-white bg-blue-600',
      },
      arrowButtonVariants: {
        default:
          'flex items-center px-4 py-2 text-slate-600 fill-slate-600 hover:text-blue-500 hover:fill-blue-500 focus:text-blue-500 focus:fill-blue-500 active:bg-blue-500 active:text-white active:fill-white transition-all duration-75',
        disabled: 'px-4 py-2 text-slate-300 fill-slate-300 bg-slate-100',
      },
    };
  },
  computed: {
    amountOfPages() {
      return Math.max(1, Math.ceil(this.itemsAmount / this.itemsPerPage));
    },
    visiblePageNumbers() {
      const currentPage = this.currentPage;
      const totalPageCount = this.amountOfPages;
      const range = this.visiblePageRange;

      let startPage = Math.max(1, currentPage - Math.floor(range / 2));
      let endPage = Math.min(totalPageCount, startPage + range - 1);

      if (endPage - startPage + 1 < range) {
        startPage = Math.max(1, endPage - range + 1);
      }

      const visiblePages = [];
      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }

      return visiblePages;
    },
    previousDisabled() {
      return this.currentPage <= 1
    },
    nextDisabled() {
      return this.currentPage >= this.amountOfPages
    },
  },
  methods: {
    paginationNumButtonClassNames(num) {
      return num === this.currentPage ? this.variants.current : this.variants.default;
    },
    nextPage() {
      this.changePage(this.currentPage + 1)
    },
    previousPage() {
      this.changePage(this.currentPage - 1)
    },
    numPage(num) {
      if(num === this.currentPage) return
      this.changePage(num)
    },
    changePage(pageNum) {
      this.$emit('change-page', pageNum)
    },
  }
};
</script>
