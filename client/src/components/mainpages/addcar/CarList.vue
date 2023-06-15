<template>
  <div class="text-gray-100 pt-16">
    <h2 class="text-gray-100 font-semibold text-3xl mb-8">Produktliste</h2>
    <div class="flex justify-center">
      <table class="table-auto">
        <thead class="bg-red-500 border border-red-500">
          <tr class="rounded-3xl">
            <th class="px-4 py-2">#</th>
            <th class="px-4 py-2">Hersteller</th>
            <th class="px-4 py-2">Modell</th>
            <th class="px-4 py-2">kW</th>
            <th class="px-4 py-2">Baujahr</th>
            <th class="px-4 py-2">Preis</th>
            <th class="px-4 py-2">Bearbeiten</th>
          </tr>
        </thead>
        <tbody v-for="car in cars" :key="car.objNr">
          <tr>
            <td class="border px-4 py-2">{{ car.objNr }}</td>
            <td class="border px-4 py-2">{{ car.brand }}</td>
            <td class="border px-4 py-2">{{ car.model }}</td>
            <td class="border px-4 py-2">{{ car.kw }}</td>
            <td class="border px-4 py-2">{{ car.manufactured }}</td>
            <td class="border px-4 py-2">{{ car.price }}</td>
            <td class="border px-4 py-2">
              <div className="md:flex md:justify-center">
                <div className="flex justify-center">
                  <router-link :to="'/editcar/' + car.id">
                    <div
                      class="p-2 min-w-56 bg-yellow-500 md:rounded-l-md md:rounded-r-none rounded-t-md font-bold"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </div>
                  </router-link>
                  <div
                    className="p-2 min-w-56 bg-red-500 md:rounded-r-md md:rounded-l-none rounded-b-md font-bold"
                    @click="setShowModal(true), (carId = car.id)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <div v-if="showModal && car.id === carId">
            <div class="fixed inset-0 flex items-center justify-center">
              <div
                class="bg-black bg-opacity-75 flex items-center justify-center w-full h-full"
                @click="setShowModal(false)"
              >
                <div class="bg-gray-600 rounded-lg p-6" @click.stop>
                  <div className="backdrop" @click="setShowModal(false)">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                      <div
                        className=" rounded-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
                      >
                        <div
                          className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t bg-gray-600"
                        >
                          <h3 className="text-3xl font-semibold text-red-500">
                            Produkt löschen
                          </h3>
                        </div>
                        <div className="relative p-6 flex-auto bg-gray-600">
                          <p
                            className="my-4 text-white text-lg leading-relaxed"
                          >
                            Möchtest du dieses Produkt wirklich löschen?
                          </p>
                        </div>
                        <div
                          className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b bg-gray-600"
                        >
                          <button
                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            @click="setShowModal(!showModal)"
                          >
                            Abbrechen
                          </button>
                          <button
                            className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            @click="confirmDelete(carId)"
                          >
                            Produkt löschen
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'CarList',
  data() {
    return {
      cars: [],
      showModal: false,
      carId: null,
    };
  },
  created() {
    this.getCars();
  },
  methods: {
    getCars() {
      axios
        .get('http://localhost:5000/car')
        .then((response) => {
          console.log(response.data);
          this.cars = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    setShowModal(value) {
      this.showModal = value;
      console.log(this.showModal);
      console.log(this.carId);
    },
    confirmDelete(id) {
      axios
        .delete(`http://localhost:5000/car/${id}`)
        .then((response) => {
          console.log(response.data);
          this.cars = this.cars.filter((car) => car.id !== this.carId);
          this.setShowModal(false);
        })
        .catch((error) => {
          console.log(error);
          this.setShowModal(false);
        });
    },
  },
};
</script>

<style scoped></style>
