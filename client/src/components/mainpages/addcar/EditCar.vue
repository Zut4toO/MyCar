<template>
  <div class="pt-16">
    <h2 class="text-gray-100 font-semibold text-3xl">
      Auto anpassen ({{ car[0]?.objNr }})
    </h2>
    <div class="justify-center flex">
      <form @submit.prevent="updateCar" class="mt-8 max-w-[400px]">
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
            @change="handleFileChange"
            class="block text-blue-500"
          />
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
        >
          Aktualisieren
        </button>
      </form>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'EditCar',
  created() {
    this.getSingleCar();
  },
  data() {
    return {
      car: [],
      formdata: {
        objNr: '',
        brand: '',
        model: '',
        kw: '',
        manufactured: '',
        price: '',
        car_image: '',
      },
    };
  },
  watch: {
    formdata: {
      handler: function (newVal) {
        console.log('formdata changed');
        console.log(newVal);
      },
      deep: true,
    },
  },
  methods: {
    getSingleCar() {
      axios
        .get('http://localhost:5000/car/' + this.$route.params.id)
        .then((response) => {
          console.log(response.data);
          this.car = response.data;
          this.initializeForm();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    initializeForm() {
      const carData = this.car[0]; // Assuming car[0] contains the car data object
      this.formdata.objNr = carData.objNr;
      this.formdata.brand = carData.brand;
      this.formdata.model = carData.model;
      this.formdata.kw = carData.kw;
      this.formdata.manufactured = carData.manufactured;
      this.formdata.price = carData.price;
    },
    updateCar() {
      const formData = new FormData();
      formData.append('brand', this.formdata.objNr);
      formData.append('brand', this.formdata.brand);
      formData.append('model', this.formdata.model);
      formData.append('kw', this.formdata.kw);
      formData.append('manufactured', this.formdata.manufactured);
      formData.append('prce', this.formdata.price);
      formData.append('car_image', this.formdata.car_image);

      axios
        .patch(
          'http://localhost:5000/car/' + this.$route.params.id,
          this.formdata,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        .then(() => {
          alert('Auto wurde aktualisiert.');
          this.$router.push('/');
        })
        .catch(() => {
          alert('Fehler beim Aktualisieren des Autos.');
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
