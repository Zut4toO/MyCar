<template>
  <div class="2xl:flex justify-center gap-20">
    <AddCarComponent />
    <CarList />
    <CsvUpload />
  </div>
</template>

<script>
import AddCarComponent from './AddCarComponent.vue';
import CarList from './CarList.vue';
import CsvUpload from './CsvUpload.vue';

export default {
  name: 'AddCar',
  components: {
    AddCarComponent,
    CarList,
    CsvUpload,
  },
};
</script>

<style scoped></style>
