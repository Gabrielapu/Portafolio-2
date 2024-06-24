<template>
  <div class="bg-slate-50">
    <div v-if="$route.name !== 'login'">
      <NavDrawer />
      <AppBar />
      <main class="min-h-screen pt-16 pb-8 pl-72 pr-7">
        <div class="pt-14 overflow-hidden">
          <RouterView />
        </div>
      </main>
      <Footer />
    </div>

    <main 
      v-else 
      class="w-screen h-screen flex flex-row items-center justify-center background"
    >
      <RouterView />
    </main>
  </div>  
</template>

<script setup>
</script>

<style scoped>
.background {
  background-image: url(../src/assets/lake.png);
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 100vh;
}
</style>
