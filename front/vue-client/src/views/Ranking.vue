<!-- <template>
  <h2 align="center">Статистика команд</h2>
  <div v-if="loading" class="loading">Загрузка рейтинга</div>

  <div v-else class="ranking-table">
    <div class="table-header">
      <div>name</div>
      <div>очки</div>
      <div>подборы</div>
      <div>передачи</div>
      <div>фолы</div>
      <div>перехваты</div>
      <div>потери</div>
      <div>блоки</div>
    </div>
    <div v-for="stat in ranking" :key="stat.id" class="table-row">
      <div>{{ stat.user_name }}</div>
      <div>{{ stat.total_points }}</div>
      <div>{{ stat.total_rebounds }}</div>
      <div>{{ stat.total_assists }}</div>
      <div>{{ stat.total_fouls }}</div>
      <div>{{ stat.total_steals }}</div>
      <div>{{ stat.total_turnovers }}</div>
      <div>{{ stat.total_blocks }}</div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

export default {
  name: "Ranking",
  setup() {
    const loading = ref(false);
    const ranking = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const totalUsers = ref(0);
    const sortBy = ref("total_points");
    const order = ref("DESC");
    const limit = ref(10);

    const API_URL = "http://localhost:3000";
    const loadRanking = async () => {
      loading.value = true;
      try {
        const response = await axios.get(`${API_URL}/ranking`, {
          params: {
            page: currentPage.value,
            limit: limit.value,
            sortBy: sortBy.value,
            order: order.value,
          },
        });

        console.log(response.data);
        ranking.value = response.data.ranking || [];
        totalPages.value = response.data.totalPages || 1;
        totalUsers.value = response.data.totalUsers || 0;
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    const totalPlayers = computed(() => {
      return ranking.value.reduce((sum, stat) => sum + stat.player_count, 0);
    });

    const totalPoints = computed(() => {
      return ranking.value.reduce((sum, stat) => sum + stat.total_points, 0);
    });

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        loadRanking();
      }
    };
    onMounted(() => {
      loadRanking();
    });

    return {
      ranking,
      loading,
      currentPage,
      totalPages,
      totalUsers,
      sortBy,
      order,
      limit,
      totalPlayers,
      totalPoints,
      loadRanking,
      changePage,
    };
  },
};
</script>
<style scoped>
</style> -->

<template>
  <div class="container">
    <h2 align="center">Статистика команд</h2>
    <div v-if="loading" class="loading">Загрузка рейтинга...</div>

    <div v-else class="stats-container">
      <div class="horizontal-table">
        <!-- Заголовок таблицы - статистические показатели -->
        <div class="header-row">
          <div class="user-name-header">Игрок / Статистика</div>
          <div class="stat-header">Очки</div>
          <div class="stat-header">Подборы</div>
          <div class="stat-header">Передачи</div>
          <div class="stat-header">Фолы</div>
          <div class="stat-header">Перехваты</div>
          <div class="stat-header">Потери</div>
          <div class="stat-header">Блоки</div>
        </div>

        <!-- Строки с пользователями и их статистикой -->
        <div v-for="stat in ranking" :key="stat.id" class="data-row">
          <div class="user-name">{{ stat.user_name }}</div>
          <div class="stat-value">{{ stat.total_points }}</div>
          <div class="stat-value">{{ stat.total_rebounds }}</div>
          <div class="stat-value">{{ stat.total_assists }}</div>
          <div class="stat-value">{{ stat.total_fouls }}</div>
          <div class="stat-value">{{ stat.total_steals }}</div>
          <div class="stat-value">{{ stat.total_turnovers }}</div>
          <div class="stat-value">{{ stat.total_blocks }}</div>
        </div>
      </div>

      <!-- Пагинация -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="page-btn"
        >
          ←
        </button>

        <span class="page-info">
          Страница {{ currentPage }} из {{ totalPages }}
        </span>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          →
        </button>
      </div>

      <!-- Общая информация -->
      <div class="summary">
        <p>Всего пользователей: {{ totalUsers }}</p>
        <p>Всего очков: {{ totalPoints }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

export default {
  name: "Ranking",
  setup() {
    const loading = ref(false);
    const ranking = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const totalUsers = ref(0);
    const sortBy = ref("total_points");
    const order = ref("DESC");
    const limit = ref(10);

    const API_URL = "http://localhost:3000";

    const loadRanking = async () => {
      loading.value = true;
      try {
        const response = await axios.get(`${API_URL}/ranking`, {
          params: {
            page: currentPage.value,
            limit: limit.value,
            sortBy: sortBy.value,
            order: order.value,
          },
        });

        console.log(response.data);
        ranking.value = response.data.ranking || [];
        totalPages.value = response.data.totalPages || 1;
        totalUsers.value = response.data.totalUsers || 0;
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    const totalPoints = computed(() => {
      return ranking.value.reduce((sum, stat) => sum + stat.total_points, 0);
    });

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        loadRanking();
      }
    };

    onMounted(() => {
      loadRanking();
    });

    return {
      ranking,
      loading,
      currentPage,
      totalPages,
      totalUsers,
      totalPoints,
      changePage,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #666;
  padding: 40px;
}

.horizontal-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
}

.header-row {
  display: grid;
  grid-template-columns: 200px repeat(7, 1fr);
  background: #2c3e50;
  color: white;
  font-weight: bold;
  text-align: center;
}

.data-row {
  display: grid;
  grid-template-columns: 200px repeat(7, 1fr);
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.data-row:hover {
  background-color: #f8f9fa;
}

.data-row:nth-child(even) {
  background-color: #f8f9fa;
}

.data-row:nth-child(even):hover {
  background-color: #e9ecef;
}

.user-name-header {
  padding: 15px;
  text-align: left;
  font-size: 14px;
  text-transform: uppercase;
}

.user-name {
  padding: 15px;
  font-weight: 500;
  color: #2c3e50;
  text-align: left;
}

.stat-header {
  padding: 15px;
  font-size: 14px;
  text-transform: uppercase;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-value {
  padding: 15px;
  text-align: center;
  font-size: 16px;
  color: #34495e;
  border-left: 1px solid #eee;
}

/* Пагинация */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 30px 0;
}

.page-btn {
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #2980b9;
}

.page-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.6;
}

.page-info {
  font-size: 14px;
  color: #666;
}

/* Общая информация */
.summary {
  background: #f8f9fa;
  padding: 15px 20px;
  border-radius: 6px;
  margin-top: 20px;
  font-size: 14px;
  color: #495057;
}

.summary p {
  margin: 5px 0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .container {
    padding: 10px;
    overflow-x: auto;
  }

  .horizontal-table {
    min-width: 800px;
  }

  .header-row,
  .data-row {
    grid-template-columns: 150px repeat(7, 80px);
  }

  .user-name-header,
  .user-name {
    padding: 10px;
    font-size: 12px;
  }

  .stat-header,
  .stat-value {
    padding: 10px;
    font-size: 12px;
  }
}
</style>
