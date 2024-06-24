<template>
  <div class="nav-drawer-option my-1">
    <div class="flex flex-row justify-between items-center rounded cursor-pointer">
      <NavDrawerLink
        class="flex flex-row pl-1 py-1"
        :class="{
          'bg-company-secondary text-white rounded-md w-full': isActive(item.active),
          'text-slate-500': !isActive(item.active)
        }"
        :name="item.title"
        :start-icon="item.icon"
        :link="item.link"
      />
      <div v-if="hasChildrens" @click="displayListItems('parent')">
        <BaseIcon
          name="fe:arrow-down"
          class="transition ease-in-out"
          :class="item.displayItems ? 'rotate-180' : ''"
        />
      </div>
    </div>
    <div v-if="hasChildrens" v-show="item.displayItems">
      <div 
        v-for="(subitem, j) in item.children"
        :key="j"
        class=""
      >
        <div class="flex justify-between items-center rounded cursor-pointer">
          <NavDrawerLink  
            class="flex flex-row pl-1 py-1"
            :class="{
              'bg-company-secondary text-white rounded-md w-full': isActive(subitem.active),
              'text-slate-500': !isActive(subitem.active)
            }"
            :name="subitem.title"
            :start-icon="subitem.icon"
            :link="subitem.link"
          />
          <div v-if="hasGrandchildrens(subitem)" @click="displayListItems('child', subitem)">
            <BaseIcon
              name="fe:arrow-down"
              class="transition ease-in-out"
              :class="subitem.displayGrandchildren ? 'rotate-180' : ''"
            />
          </div>
        </div>
        <div v-if="hasGrandchildrens(subitem)" v-show="subitem.displayGrandchildren">
          <NavDrawerLink
            v-for="(grandson, k) in subitem.children"
            :key="k"
            class="flex flex-row pl-4 py-1"
            :class="{
              'bg-company-secondary text-white rounded-md w-full': isActive(grandson.active),
              'text-slate-500': !isActive(grandson.active)
            }"
            :name="grandson.title"
            :start-icon="grandson.icon"
            :link="grandson.link"
          />
        </div>
      </div>      
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavDrawerOption',
  props: {
    item: { type: Object, default: () => {} },
  },
  computed: {
    hasChildrens() {
      return this.item.children && this.item.children?.length > 0
    },
    hasGrandchildrens(subitem) {
      return subitem => subitem.children && subitem.children?.length > 0
    }
  },
  methods: {
    isActive(route) {
      return this.$route?.name === route 
    },
    displayListItems(type, item) {
      if(type === 'parent') {
        this.$emit('displayChildren', this.item)
      } 
      if(type === 'child') {
        this.$emit('displayGrandchildren', { subitem: item, parent: this.item })
      }
    },
  },
}
</script>
