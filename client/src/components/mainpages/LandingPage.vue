<template>
  <div>
    <h2 class="text-gray-100 text-3xl font-semibold pt-16">
      Wähle dein Traumauto
    </h2>

    <div className="flex justify-center py-16">
      <div className="grid grid-cols-12 gap-8">
        <div
          v-for="car in cars"
          :key="car.id"
          class="2xl:col-span-4 md:col-span-6 col-span-12 w-[21rem]"
        >
          <div>
            <div
              class="pb-0 md:pb-2 md:py-4 py:0 md:px-4 px-0 border-4 bg-zinc-900 border-red-500 rounded-lg h-full justify-center"
            >
              <div className="md:block flex  justify-center">
                <div className="md:mx-5 md:mt-5 mx-1 mt-1 md:pl-[0px] pl-[1px]">
                  <img
                    :src="`http://localhost:5000/uploads/images/${car.image_path}`"
                    alt="Image of a car"
                    className="md:w-64 md:h-64 rounded md:full object-cover text-gray-100"
                  />
                </div>
              </div>
              <div class="flex justify-between md:pl-0 pl-5">
                <div class="md:py-4 py-1">
                  <p class="text-sm font-semibold text-gray-400">Artikel</p>
                  <p class="text-lg font-semibold text-red-500">
                    {{ car.brand + ' ' + car.model }}
                  </p>
                </div>
                <div class="md:py-4 py-1 md:pr-0 pr-4">
                  <p class="text-sm font-semibold text-gray-400">Baujahr</p>
                  <p class="text-lg font-semibold text-red-500">
                    {{ car.manufactured }}
                  </p>
                </div>
              </div>
              <div class="md:py-4 py-1 md:pr-0 pr-4 flex justify-between">
                <div>
                  <p class="text-sm font-semibold text-gray-400">kW</p>
                  <p class="text-lg font-semibold text-red-500">
                    {{ car.kw }} kw ({{ Math.round(car.kw * 1.36) }}
                    PS)
                  </p>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-400">Preis</p>
                  <p class="text-lg font-semibold text-red-500">
                    {{ car.price }}
                  </p>
                </div>
              </div>
              <button
                class="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
                @click="deleteCar(car.id)"
              >
                Auto entfernen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'LandingPage',
  created() {
    this.getCars();
  },
  data() {
    return {
      cars: [],
    };
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
    deleteCar(id) {
      axios
        .delete(`http://localhost:5000/car/${id}`)
        .then((response) => {
          console.log(response.data);
          this.cars = this.cars.filter((car) => car.id !== id);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped></style>
