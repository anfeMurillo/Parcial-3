<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

import { API_URL } from '../config';

const bookings = ref<any[]>([]);

onMounted(async () => {
  try {
    const response = await axios.get(`${API_URL}/bookings/my-bookings`);
    bookings.value = response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
  }
});
</script>

<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-extrabold text-gray-900">Mis Entradas</h1>
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" class="divide-y divide-gray-200">
        <li v-for="booking in bookings" :key="booking.id">
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-indigo-600 truncate">{{ booking.eventTitle }}</p>
              <div class="ml-2 flex-shrink-0 flex">
                <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Confirmado
                </p>
              </div>
            </div>
            <div class="mt-2 sm:flex sm:justify-between">
              <div class="sm:flex">
                <p class="flex items-center text-sm text-gray-500">
                  Fecha: {{ booking.eventDate }}
                </p>
                <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                  Boletos: {{ booking.ticketCount }}
                </p>
                <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                  Total: ${{ booking.totalAmount }}
                </p>
              </div>
              <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                <p>
                  Comprado el {{ new Date(booking.purchaseDate).toLocaleDateString() }}
                </p>
              </div>
            </div>
          </div>
        </li>
        <li v-if="bookings.length === 0" class="px-4 py-4 sm:px-6 text-center text-gray-500">
          Aún no has comprado boletos.
        </li>
      </ul>
    </div>
  </div>
</template>
