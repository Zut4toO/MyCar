<template>
  <div class="pt-16">
    <h2 class="text-gray-100 font-semibold text-3xl">Auto hinzufügen</h2>
    <div class="justify-center flex">
      <form @submit.prevent="createCar" class="mt-8 max-w-[400px]">
        <div class="mb-4">
          <label for="objNr" class="text-gray-100">Objekt Nr.</label>
          <input
            type="text"
            id="objNr"
            v-model="formdata.objNr"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div class="mb-4">
          <label for="brand" class="text-gray-100">Hersteller</label>
          <input
            type="text"
            id="brand"
            v-model="formdata.brand"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div class="mb-4">
          <label for="model" class="text-gray-100">Modell</label>
          <input
            type="text"
            id="model"
            v-model="formdata.model"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div class="mb-4">
          <label for="kw" class="text-gray-100">kW</label>
          <input
            type="text"
            id="kw"
            v-model="formdata.kw"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div class="mb-4">
          <label for="manufactured" class="text-gray-100">Baujahr</label>
          <input
            type="text"
            id="manufactured"
            v-model="formdata.manufactured"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div class="mb-4">
          <label for="price" class="text-gray-100">Preis</label>
          <input
            type="text"
            id="price"
            v-model="formdata.price"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div class="mb-4">
          <label for="car_image" class="text-gray-100">Bild hochladen</label>
          <input
            type="file"
            id="car_image"
            class="block text-blue-500"
            @change="handleFileChange"
          />
        </div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Hinzufügen
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'AddCarComponent',
  data() {
    return {
      formdata: {
        objNr: '',
        brand: '',
        model: '',
        kw: '',
        manufactured: '',
        price: '',
        car_image: null,
      },
    };
  },
  methods: {
    createCar() {
      const formData = new FormData();
      formData.append('objNr', this.formdata.brand);
      formData.append('brand', this.formdata.brand);
      formData.append('model', this.formdata.model);
      formData.append('kw', this.formdata.kw);
      formData.append('manufactured', this.formdata.manufactured);
      formData.append('prce', this.formdata.price);
      formData.append('car_image', this.formdata.car_image);
      axios
        .post('http://localhost:5000/car', this.formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          alert('Neues Auto wurde hinzugefügt.');
          this.$router.push('/');
        })
        .catch(() => {
          alert('Fehler beim Hinzufügen des Autos.');
        });
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      this.formdata.car_image = file;
    },
  },
};
</script>

<style scoped></style>
