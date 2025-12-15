<template>
  <h2 align="center">Статистика команд</h2>
  <div v-if="loading" class="loading">Загрузка рейтинга</div>

  <div v-else class="ranking-table">
    <div class="table-header">
      <div>очки</div>
      <div>подборы</div>
      <div>передачи</div>
      <div>фолы</div>
      <div>перехваты</div>
      <div>потери</div>
      <div>блоки</div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  name: "Ranking",
  setup() {
    const loading = ref(false);
    const ranking = ref([]);
    const API_URL = "http://localohst:3000";
    const loadRanking = async () => {
      loading.value = true;
      try {
        const response = await axios.get(`${API_URL}/ranking`);
        ranking.value = response.data.ranking || response.data;
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };
    onMounted(() => {
      loadRanking();
    });

    return {
      ranking,
      loading,
    };
  },
};
</script>
