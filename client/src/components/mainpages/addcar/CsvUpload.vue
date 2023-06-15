<template>
  <div class="pt-16">
    <h2 class="text-gray-100 font-semibold text-3xl mb-8">CSV-Upload</h2>
    <div class="justify-center flex">
      <form @submit.prevent="createCar" class="mt-8 max-w-[400px]">
        <div class="mb-4">
          <label for="car_csv" class="text-gray-100">CSV-Datei</label>
          <input
            type="file"
            id="car_csv"
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
  name: 'CsvUpload',
  data() {
    return {
      formdata: {
        car_csv: null,
      },
    };
  },
  methods: {
    createCar() {
      const formData = new FormData();
      formData.append('car_csv', this.formdata.car_csv);
      for (let pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
      console.log(formData.get('car_csv'));
      axios
        .post('http://localhost:5000/car/csv', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          alert(res.data.message);
          this.$router.push('/');
        })
        .catch((err) => {
          alert('Fehler beim Hinzufügen des Autos.');
          console.log(err);
        });
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      this.formdata.car_csv = file;
      console.log(file.name);
    },
  },
};
</script>

<style scoped></style>
