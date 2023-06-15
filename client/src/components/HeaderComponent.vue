<template>
  <div class="bg-zinc-700 flex items-center">
    <router-link to="/">
      <div class="flex items-center">
        <img src="../assets/logo.jpg" alt="Test Logo" class="w-16 h-16" />
        <div class="ml-2 font-bold">
          <div class="text-gray-100 text-xl">MyCar</div>
        </div>
      </div>
    </router-link>

    <div class="ml-auto mr-8 font-semibold">
      <router-link to="/addcar" class="text-gray-100 text-sm"
        >Auto hinzufügen</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderComponent',
};
</script>

<style scoped></style>
