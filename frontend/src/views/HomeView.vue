<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

import { API_URL } from '../config';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  availableSeats: number;
}

const events = ref<Event[]>([]);

onMounted(async () => {
  try {
    const response = await axios.get(`${API_URL}/events`);
    events.value = response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
});
</script>

<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
        Próximos Eventos
      </h1>
      <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500">
        Descubre y reserva entradas para los mejores eventos de la ciudad.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="event in events" :key="event.id" class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">{{ event.title }}</h3>
          <p class="mt-1 text-sm text-gray-500">{{ event.date }} • {{ event.location }}</p>
          <p class="mt-2 text-sm text-gray-600 line-clamp-3">{{ event.description }}</p>
          <div class="mt-4 flex items-center justify-between">
            <span class="text-lg font-bold text-indigo-600">${{ event.price }}</span>
            <router-link :to="`/events/${event.id}`" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Ver Detalles
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
