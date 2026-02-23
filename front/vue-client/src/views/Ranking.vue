<template>
  <div class="modal-players" v-if="pleyersModal">
    <button @click="closeModal">x</button>
    <h2>Игроки</h2>
    <table>
      <tr v-for="p in playersModalArray" :key="p.id">
        <td>
          <div v-if="p.avatar">
            <img :src="getUrl(p.avatar)" width="150px" />
          </div>
        </td>
        <td>{{ p.name }}</td>

        <td class="color_blak">
          {{ p.cost }}
          <img
            data-v-2a3aebcb=""
            src="http://localhost:3000/img/basket-coin.png"
            width="24px"
            alt=""
          />
        </td>
      </tr>
    </table>
  </div>
  <div class="container">
    <Timer />

    <h2 align="center">Статистика команд</h2>

    <!-- Показать индикатор загрузки -->
    <div v-if="loading" class="loading">Загрузка рейтинга...</div>

    <!-- Если участников меньше 2, показать сообщение -->
    <div v-else-if="totalUsers < 2" class="not-enough-teams">
      <div class="warning-card">
        <h3>⚠️ Недостаточно участников</h3>
        <p>Для начала соревнований необходимо минимум 2 команды.</p>
        <p>
          Текущее количество участников: <strong>{{ totalUsers }}</strong>
        </p>
        <div class="suggestion">
          <p>Создайте команду и пригласите других игроков присоединиться!</p>
        </div>
      </div>
    </div>

    <!-- Основной контент - если загрузка завершена и достаточно участников -->
    <div v-else class="stats-container">
      <!-- Таблица рейтинга команд -->
      <div class="horizontal-table">
        <!-- Заголовок таблицы -->
        <div class="header-row">
          <div class="user-name-header">Место</div>
          <div class="user-name-header">Игрока</div>
          <div class="stat-header">Очки</div>
          <div class="stat-header">Подборы</div>
          <div class="stat-header">Передачи</div>
          <div class="stat-header">Фолы</div>
          <div class="stat-header">Перехваты</div>
          <div class="stat-header">Потери</div>
          <div class="stat-header">Блок-шоты</div>
          <div class="stat-header result-header">Результат</div>
        </div>

        <!-- Строки с пользователями -->
        <div
          v-for="(stat, index) in sortedRanking"
          :key="stat.id"
          class="data-row"
          :class="{
            'winner-row': hasSingleWinner && index === 0,
            'tie-row': isTieParticipant(stat),
          }"
        >
          <div class="place">{{ index + 1 }}</div>
          <div class="user-name">
            <div class="actions-group">
              <button
                @click="viewTeamPlayers(stat)"
                class="btn btn-outline players-btn"
              >
                {{ stat.user_name }}
              </button>
            </div>
          </div>

          <!-- Очки -->
          <div
            class="stat-value"
            :class="{
              'best-cell': stat.total_points === maxPoints && maxPoints > 0,
              'zero-stat': stat.total_points === 0,
            }"
          >
            {{ stat.total_points }}
            <span v-if="stat.total_points === 0" class="zero-indicator">-</span>
          </div>

          <!-- Подборы -->
          <div
            class="stat-value"
            :class="{
              'best-cell':
                stat.total_rebounds === maxRebounds && maxRebounds > 0,
              'zero-stat': stat.total_rebounds === 0,
            }"
          >
            {{ stat.total_rebounds }}
            <span v-if="stat.total_rebounds === 0" class="zero-indicator"
              >-</span
            >
          </div>

          <!-- Передачи -->
          <div
            class="stat-value"
            :class="{
              'best-cell': stat.total_assists === maxAssists && maxAssists > 0,
              'zero-stat': stat.total_assists === 0,
            }"
          >
            {{ stat.total_assists }}
            <span v-if="stat.total_assists === 0" class="zero-indicator"
              >-</span
            >
          </div>

          <!-- Фолы -->
          <div
            class="stat-value"
            :class="{
              'best-cell': stat.total_fouls === minFouls,
              'zero-stat': stat.total_fouls === 0,
            }"
          >
            {{ stat.total_fouls }}
            <span v-if="stat.total_fouls === 0" class="zero-indicator">-</span>
          </div>

          <!-- Перехваты -->
          <div
            class="stat-value"
            :class="{
              'best-cell': stat.total_steals === maxSteals && maxSteals > 0,
              'zero-stat': stat.total_steals === 0,
            }"
          >
            {{ stat.total_steals }}
            <span v-if="stat.total_steals === 0" class="zero-indicator">-</span>
          </div>

          <!-- Потери -->
          <div
            class="stat-value"
            :class="{
              'best-cell': stat.total_turnovers === minTurnovers,
              'zero-stat': stat.total_turnovers === 0,
            }"
          >
            {{ stat.total_turnovers }}
            <span v-if="stat.total_turnovers === 0" class="zero-indicator"
              >-</span
            >
          </div>

          <!-- Блоки -->
          <div
            class="stat-value"
            :class="{
              'best-cell': stat.total_blocks === maxBlocks && maxBlocks > 0,
              'zero-stat': stat.total_blocks === 0,
            }"
          >
            {{ stat.total_blocks }}
            <span v-if="stat.total_blocks === 0" class="zero-indicator">-</span>
          </div>

          <div class="result-value">{{ stat.resultScore }}</div>
        </div>
      </div>

      <!-- Секция победителя - показывается только если есть ЕДИНСТВЕННЫЙ победитель -->
      <div v-if="hasSingleWinner" class="winner-section">
        <h3>🏆 Победитель 🏆</h3>
        <div class="winner-card">
          <div class="winner-name">{{ winner.user_name }}</div>
          <div class="winner-score">
            Общий результат: {{ winner.resultScore }} очков
          </div>
          <div class="winner-stats">
            <div class="stat-item">
              <span class="stat-label">Очки:</span>
              <span
                class="stat-number"
                :class="{
                  'best-stat':
                    winner.total_points === maxPoints && maxPoints > 0,
                  'zero-stat-number': winner.total_points === 0,
                }"
              >
                {{ winner.total_points }}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Подборы:</span>
              <span
                class="stat-number"
                :class="{
                  'best-stat':
                    winner.total_rebounds === maxRebounds && maxRebounds > 0,
                  'zero-stat-number': winner.total_rebounds === 0,
                }"
              >
                {{ winner.total_rebounds }}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Передачи:</span>
              <span
                class="stat-number"
                :class="{
                  'best-stat':
                    winner.total_assists === maxAssists && maxAssists > 0,
                  'zero-stat-number': winner.total_assists === 0,
                }"
              >
                {{ winner.total_assists }}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Перехваты:</span>
              <span
                class="stat-number"
                :class="{
                  'best-stat':
                    winner.total_steals === maxSteals && maxSteals > 0,
                  'zero-stat-number': winner.total_steals === 0,
                }"
              >
                {{ winner.total_steals }}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Блоки:</span>
              <span
                class="stat-number"
                :class="{
                  'best-stat':
                    winner.total_blocks === maxBlocks && maxBlocks > 0,
                  'zero-stat-number': winner.total_blocks === 0,
                }"
              >
                {{ winner.total_blocks }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Если участников достаточно, но есть ничья по очкам -->
      <div v-else-if="totalUsers >= 2 && hasTie" class="tie-section">
        <div class="tie-card">
          <h3>⚖️ Ничья!</h3>
          <p>Несколько пользователей набрали одинаковое количество очков:</p>
          <div class="tie-teams">
            <div v-for="team in tieTeams" :key="team.id" class="tie-team">
              <span class="team-name">{{ team.user_name }}</span>
              <span class="team-score">{{ team.resultScore }} очков</span>
            </div>
          </div>
          <p class="tie-hint">
            Для определения победителя нужны дополнительные критерии или
            матч-реванш! Статистика скоро обновиться!
          </p>
        </div>
      </div>

      <!-- Если участников достаточно, но никто не набрал очков -->
      <div
        v-else-if="totalUsers >= 2 && !hasAnyScores"
        class="no-winner-section"
      >
        <div class="no-winner-card">
          <h3>🏆 Победитель пока не определен</h3>
          <p>Ни одна команда еще не набрала очков в соревнованиях.</p>
          <p>Первые игры скоро начнутся!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import Timer from "../components/Timer.vue";

export default {
  name: "Ranking",
  components: {
    Timer,
  },
  setup() {
    // Реактивные переменные состояния
    const loading = ref(false); // Индикатор загрузки
    const ranking = ref([]); // Данные рейтинга с сервера
    const currentPage = ref(1); // Текущая страница пагинации
    const totalPages = ref(1); // Всего страниц
    const totalUsers = ref(0); // Общее количество пользователей
    const sortBy = ref("total_points"); // Поле для сортировки
    const order = ref("DESC"); // Порядок сортировки
    const limit = ref(10); // Количество записей на странице
    const currentTime = ref(new Date().toLocaleTimeString("ru-RU"));
    const pleyersModal = ref(false);
    const playersModalArray = ref([]);

    const API_URL = "http://localhost:3000"; // Базовый URL API

    // Функция загрузки данных рейтинга с сервера
    const loadRanking = async () => {
      loading.value = true; // Показать индикатор загрузки
      try {
        // Запрос к API для получения данных рейтинга
        const response = await axios.get(`${API_URL}/ranking`, {
          params: {
            page: currentPage.value,
            limit: limit.value,
            sortBy: sortBy.value,
            order: order.value,
          },
        });

        // Сохраняем полученные данные
        ranking.value = response.data.ranking || [];
        totalPages.value = response.data.totalPages || 1;
        totalUsers.value = response.data.totalUsers || 0;
      } catch (error) {
        console.error(error); // Логирование ошибок
      } finally {
        loading.value = false; // Скрыть индикатор загрузки
      }
    };

    // Функция проверки наличия ненулевых показателей у команды
    const hasAnyNonZeroStats = (stat) => {
      return (
        stat.total_points > 0 ||
        stat.total_rebounds > 0 ||
        stat.total_assists > 0 ||
        stat.total_steals > 0 ||
        stat.total_blocks > 0 ||
        stat.total_fouls > 0 ||
        stat.total_turnovers > 0
      );
    };

    // Вычисляемое свойство: максимальное количество очков среди команд
    const maxPoints = computed(() => {
      const nonZeroValues = ranking.value
        .filter(hasAnyNonZeroStats)
        .map((stat) => stat.total_points)
        .filter((value) => value > 0);
      return nonZeroValues.length > 0 ? Math.max(...nonZeroValues) : 0;
    });

    // Вычисляемое свойство: максимальное количество подборов
    const maxRebounds = computed(() => {
      const nonZeroValues = ranking.value
        .filter(hasAnyNonZeroStats)
        .map((stat) => stat.total_rebounds)
        .filter((value) => value > 0);
      return nonZeroValues.length > 0 ? Math.max(...nonZeroValues) : 0;
    });

    // Вычисляемое свойство: максимальное количество передач
    const maxAssists = computed(() => {
      const nonZeroValues = ranking.value
        .filter(hasAnyNonZeroStats)
        .map((stat) => stat.total_assists)
        .filter((value) => value > 0);
      return nonZeroValues.length > 0 ? Math.max(...nonZeroValues) : 0;
    });

    // Вычисляемое свойство: максимальное количество перехватов
    const maxSteals = computed(() => {
      const nonZeroValues = ranking.value
        .filter(hasAnyNonZeroStats)
        .map((stat) => stat.total_steals)
        .filter((value) => value > 0);
      return nonZeroValues.length > 0 ? Math.max(...nonZeroValues) : 0;
    });

    // Вычисляемое свойство: максимальное количество блоков
    const maxBlocks = computed(() => {
      const nonZeroValues = ranking.value
        .filter(hasAnyNonZeroStats)
        .map((stat) => stat.total_blocks)
        .filter((value) => value > 0);
      return nonZeroValues.length > 0 ? Math.max(...nonZeroValues) : 0;
    });

    // просмотр команды игрока

    // Вычисляемое свойство: минимальное количество фолов
    const minFouls = computed(() => {
      const values = ranking.value
        .filter(hasAnyNonZeroStats)
        .map((stat) => stat.total_fouls);
      return values.length > 0 ? Math.min(...values) : 0;
    });

    // Вычисляемое свойство: минимальное количество потерь
    const minTurnovers = computed(() => {
      const values = ranking.value
        .filter(hasAnyNonZeroStats)
        .map((stat) => stat.total_turnovers);
      return values.length > 0 ? Math.min(...values) : 0;
    });

    // Вычисляемое свойство: подсчет результатов для каждой команды
    const calculateResults = computed(() => {
      if (!ranking.value.length) return [];

      return ranking.value.map((stat) => {
        let resultScore = 0;

        // Если все показатели = 0, команда получает 0 очков
        if (!hasAnyNonZeroStats(stat)) {
          return {
            ...stat,
            resultScore: 0,
          };
        }

        // Положительные показатели (чем больше - тем лучше)
        // Очки начисляются только если значение больше 0
        if (
          stat.total_points > 0 &&
          stat.total_points === maxPoints.value &&
          maxPoints.value > 0
        )
          resultScore += 1;
        if (
          stat.total_rebounds > 0 &&
          stat.total_rebounds === maxRebounds.value &&
          maxRebounds.value > 0
        )
          resultScore += 1;
        if (
          stat.total_assists > 0 &&
          stat.total_assists === maxAssists.value &&
          maxAssists.value > 0
        )
          resultScore += 1;
        if (
          stat.total_steals > 0 &&
          stat.total_steals === maxSteals.value &&
          maxSteals.value > 0
        )
          resultScore += 1;
        if (
          stat.total_blocks > 0 &&
          stat.total_blocks === maxBlocks.value &&
          maxBlocks.value > 0
        )
          resultScore += 1;

        // Отрицательные показатели (чем меньше - тем лучше)
        if (minFouls.value > 0 && stat.total_fouls === minFouls.value)
          resultScore += 1;
        if (
          minTurnovers.value > 0 &&
          stat.total_turnovers === minTurnovers.value
        )
          resultScore += 1;

        return {
          ...stat,
          resultScore,
        };
      });
    });

    // Вычисляемое свойство: сортировка команд по результату (по убыванию)
    const sortedRanking = computed(() => {
      return [...calculateResults.value].sort(
        (a, b) => b.resultScore - a.resultScore,
      );
    });

    // Вычисляемое свойство: максимальный результат среди всех команд
    const maxResultScore = computed(() => {
      if (sortedRanking.value.length === 0) return 0;
      return sortedRanking.value[0].resultScore;
    });

    // Вычисляемое свойство: команды с максимальным результатом
    const topTeams = computed(() => {
      if (sortedRanking.value.length === 0 || maxResultScore.value === 0)
        return [];
      return sortedRanking.value.filter(
        (team) => team.resultScore === maxResultScore.value,
      );
    });

    // Вычисляемое свойство: есть ли ничья (несколько команд с максимальным счетом)
    const hasTie = computed(() => {
      return topTeams.value.length > 1 && maxResultScore.value > 0;
    });

    // Вычисляемое свойство: есть ли единственный победитель
    const hasSingleWinner = computed(() => {
      return topTeams.value.length === 1 && maxResultScore.value > 0;
    });

    // Вычисляемое свойство: победитель (если есть единственный)
    const winner = computed(() => {
      return hasSingleWinner.value ? sortedRanking.value[0] : null;
    });

    // Вычисляемое свойство: команды с ничьей
    const tieTeams = computed(() => {
      return topTeams.value;
    });

    // Функция проверки, является ли команда участником ничьей
    const isTieParticipant = (team) => {
      return hasTie.value && team.resultScore === maxResultScore.value;
    };

    // Вычисляемое свойство: проверка, есть ли у кого-то очки в соревнованиях
    const hasAnyScores = computed(() => {
      return sortedRanking.value.some((stat) => stat.resultScore > 0);
    });

    // Функция изменения страницы пагинации
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        loadRanking();
      }
    };

    // Хук жизненного цикла: выполняется при монтировании компонента
    onMounted(() => {
      loadRanking();
      setInterval(() => {
        currentTime.value = new Date().toLocaleTimeString("ru-RU");
      }, 1000);
    });

    const getUrl = (avatar) => {
      if (avatar.includes("http")) {
        return `${avatar}`;
      } else {
        return `http://localhost:3000${avatar}`;
      }
    };
    const viewTeamPlayers = async (stat) => {
      //console.log(stat);
      //pleyersModal.value = true;
      //playersModalArray = team.players;
      const user_name = stat.user_name;
      try {
        // Запрос к API для получения данных рейтинга
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `http://localhost:3000/team/user/${user_name}/teams`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (response.data.success) {
          const players = response.data.team.players;
          playersModalArray.value = players;
          pleyersModal.value = true;

          console.log(players);
        }
      } catch (error) {
        console.error(error); // Логирование ошибок
      } finally {
      }
    };
    const closeModal = () => {
      pleyersModal.value = false;
    };

    return {
      closeModal,
      getUrl,
      ranking,
      loading,
      currentPage,
      totalPages,
      totalUsers,
      sortedRanking,
      winner,
      maxPoints,
      maxRebounds,
      maxAssists,
      maxSteals,
      maxBlocks,
      minFouls,
      minTurnovers,
      hasAnyScores,
      hasTie,
      hasSingleWinner,
      tieTeams,
      isTieParticipant,
      changePage,
      currentTime,
      viewTeamPlayers,
      pleyersModal,
      playersModalArray,
    };
  },
  methods: {
    /*async viewTeamPlayers(stat) {
      //console.log(stat);
      //pleyersModal.value = true;
      //playersModalArray = team.players;
      const user_name = stat.user_name;
      try {
        // Запрос к API для получения данных рейтинга
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `http://localhost:3000/team/user/${user_name}/teams`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (response.data.success) {
          playersModalArray.value = true;
          const players = response.data.team;
          console.log(players);
        }
      } catch (error) {
        console.error(error); // Логирование ошибок
      } finally {
      }
    },*/
  },
};
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #666;
  padding: 40px;
}

.not-enough-teams {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.warning-card {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-radius: 12px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  border: 3px solid #ffc107;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.warning-card h3 {
  color: #856404;
  margin-bottom: 15px;
  font-size: 24px;
}

.warning-card p {
  color: #856404;
  margin-bottom: 10px;
  font-size: 16px;
}

.warning-card strong {
  font-size: 20px;
  color: #d35400;
}

.suggestion {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(133, 100, 4, 0.3);
}

.suggestion p {
  font-style: italic;
  color: #7d6608;
}

.horizontal-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
}

.header-row {
  display: grid;
  grid-template-columns: 60px 200px repeat(7, 1fr) 100px;
  background: #2c3e50;
  color: white;
  font-weight: bold;
  text-align: center;
}

.data-row {
  display: grid;
  grid-template-columns: 60px 200px repeat(7, 1fr) 100px;
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

.winner-row {
  background-color: #fff8e1 !important;
  border-left: 4px solid #ffc107;
  font-weight: 500;
}

.winner-row:hover {
  background-color: #ffecb3 !important;
}

.tie-row {
  background-color: #f0f8ff !important;
  border-left: 4px solid #3498db;
  font-weight: 500;
}

.tie-row:hover {
  background-color: #e1f0ff !important;
}

.place {
  padding: 15px;
  text-align: center;
  font-weight: bold;
  color: #2c3e50;
  font-size: 16px;
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

.result-header {
  background-color: #27ae60;
  color: white;
}

.stat-value {
  padding: 25px;
  text-align: center;
  font-size: 16px;
  color: #34495e;
  border-left: 1px solid #eee;
  transition: all 0.3s ease;
  position: relative;
}

.zero-stat {
  color: #95a5a6 !important;
  font-style: italic;
  opacity: 0.7;
}

.zero-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 10px;
  color: #bdc3c7;
}

.best-cell {
  background-color: #d4edda !important;
  color: #155724 !important;
  font-weight: bold;
  position: relative;
}

.best-cell::after {
  content: "👑";
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 12px;
}

.result-value {
  padding: 25px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #27ae60;
  background-color: rgba(39, 174, 96, 0.1);
  border-left: 1px solid #eee;
}

.winner-section {
  margin: 30px 0;
  text-align: center;
}

.winner-section h3 {
  color: #d35400;
  margin-bottom: 20px;
  font-size: 24px;
}

.winner-card {
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
  border: 3px solid #ffc107;
}

.winner-name {
  font-size: 28px;
  font-weight: bold;
  color: #d35400;
  margin-bottom: 10px;
}

.winner-score {
  font-size: 20px;
  color: #27ae60;
  margin-bottom: 20px;
  font-weight: 500;
}

.winner-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-top: 15px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.stat-number {
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
}

.best-stat {
  color: #155724 !important;
  position: relative;
}

.best-stat::after {
  content: "👑";
  margin-left: 5px;
  font-size: 12px;
}

.zero-stat-number {
  color: #95a5a6 !important;
  font-style: italic;
}

.tie-section {
  margin: 30px 0;
  text-align: center;
}

.tie-card {
  background: linear-gradient(135deg, #e8f4fc 0%, #d6eaf8 100%);
  border-radius: 12px;
  padding: 25px;
  max-width: 600px;
  margin: 0 auto;
  border: 3px solid #3498db;
}

.tie-card h3 {
  color: #2980b9;
  margin-bottom: 15px;
  font-size: 24px;
}

.tie-card > p {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 16px;
}

.tie-teams {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
  max-height: 200px;
  overflow-y: auto;
}

.tie-team {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.team-name {
  font-weight: bold;
  color: #2c3e50;
  font-size: 16px;
}

.team-score {
  font-weight: bold;
  color: #27ae60;
  font-size: 16px;
}

.tie-hint {
  font-style: italic;
  color: #7f8c8d;
  margin-top: 15px;
  font-size: 14px;
  padding-top: 15px;
  border-top: 1px solid rgba(52, 152, 219, 0.3);
}

.no-winner-section {
  margin: 30px 0;
  text-align: center;
}

.no-winner-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 25px;
  max-width: 500px;
  margin: 0 auto;
  border: 3px solid #95a5a6;
}

.no-winner-card h3 {
  color: #7f8c8d;
  margin-bottom: 15px;
  font-size: 24px;
}

.no-winner-card p {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 16px;
}

@media (max-width: 1200px) {
  .container {
    overflow-x: auto;
  }

  .horizontal-table {
    min-width: 1200px;
  }

  .header-row,
  .data-row {
    grid-template-columns: 60px 180px repeat(7, 1fr) 100px;
  }

  .winner-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .horizontal-table {
    min-width: 1100px;
  }

  .header-row,
  .data-row {
    grid-template-columns: 50px 150px repeat(7, 80px) 90px;
  }

  .place,
  .user-name-header,
  .user-name,
  .stat-header,
  .stat-value,
  .result-value {
    padding: 10px;
    font-size: 12px;
  }

  .result-value {
    font-size: 14px;
  }

  .winner-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .warning-card {
    padding: 20px;
    margin: 0 10px;
  }

  .warning-card h3 {
    font-size: 20px;
  }

  .warning-card p {
    font-size: 14px;
  }

  .tie-card {
    padding: 20px;
    margin: 0 10px;
  }

  .tie-card h3 {
    font-size: 20px;
  }

  .tie-card p {
    font-size: 14px;
  }

  .team-name,
  .team-score {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .winner-stats {
    grid-template-columns: 1fr;
  }

  .no-winner-card,
  .winner-card,
  .tie-card {
    padding: 15px;
  }

  .winner-name {
    font-size: 22px;
  }

  .winner-score {
    font-size: 16px;
  }

  .tie-card h3 {
    font-size: 18px;
  }

  .tie-team {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }
}

/* Само модальное окно */
.modal-players {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  z-index: 1000;
  overflow: hidden;
  animation: modalSlide 0.3s ease-out;
}

@keyframes modalSlide {
  from {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

/* Заголовок модального окна */
.modal-players h2 {
  margin: 0;
  padding: 24px 32px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-players h2::before {
  content: "👥";
  font-size: 28px;
}

/* Кнопка закрытия */
.modal-players > button {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: white;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-players > button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* Контейнер таблицы */
.modal-players > table {
  width: 100%;
  border-collapse: collapse;
  max-height: calc(85vh - 120px);
  overflow-y: auto;
  display: block;
}

/* Заголовок таблицы */
/* .modal-players > table::before {
  content: "";
  display: block;
  background: #f8fafc;
  height: 60px;
  border-bottom: 2px solid #e2e8f0;
} */

.modal-players > table thead {
  /* position: sticky; */
  top: 0;
  z-index: 5;
  background: #f8fafc;
}

.modal-players > table tr:first-child {
  /*position: sticky;*/
  top: 0;
  background: #f8fafc;
  z-index: 5;
}

.modal-players > table tr:first-child th {
  padding: 20px 24px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e2e8f0;
}

/* Ячейки таблицы */
.modal-players > table tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
}

.modal-players > table tr:hover {
  background-color: #f8fafc;
}

.modal-players > table td {
  padding: 20px 24px;
  vertical-align: middle;
}

/* Колонка с именем */
.modal-players > table td:nth-child(2) {
  font-weight: 600;
  color: #1e293b;
  font-size: 16px;
  min-width: 200px;
}

/* Колонка с аватаром */
.modal-players > table td:nth-child(1) {
  text-align: center;
  min-width: 180px;
}

.modal-players > table td:nth-child(1) div {
  display: inline-block;
}

.modal-players > table td:nth-child(1) img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.modal-players > table td:nth-child(1) img:hover {
  transform: scale(1.05);
}

/* Колонка со стоимостью */
.modal-players > table td:last-child {
  text-align: right;
  font-weight: 700;
  color: #10b981;
  font-size: 18px;
  min-width: 266px;
}

/* .modal-players > table td:last-child::after {
  content: " ₽";
  font-size: 16px;
  opacity: 0.8;
} */

/* Полоса прокрутки */
.modal-players > table::-webkit-scrollbar {
  width: 8px;
}

.modal-players > table::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.modal-players > table::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.modal-players > table::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Пустое состояние */
.modal-players > table:empty::after {
  content: "Нет игроков";
  display: block;
  text-align: center;
  padding: 60px;
  color: #94a3b8;
  font-size: 16px;
  font-weight: 500;
}
.color_blak {
  color: black;
}
/* Адаптивность */
@media (max-width: 768px) {
  .modal-players {
    width: 95%;
    max-height: 90vh;
    border-radius: 12px;
  }

  .modal-players h2 {
    padding: 20px 24px;
    font-size: 20px;
  }

  .modal-players > button {
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    font-size: 18px;
  }

  .modal-players > table td {
    padding: 16px 20px;
  }

  .modal-players > table td:first-child {
    min-width: 150px;
    font-size: 15px;
  }

  .modal-players > table td:nth-child(2) img {
    width: 60px;
    height: 60px;
  }

  .modal-players > table td:last-child {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .modal-players h2 {
    padding: 16px 20px;
    font-size: 18px;
  }

  .modal-players h2::before {
    font-size: 24px;
  }

  .modal-players > table td {
    padding: 12px 16px;
  }

  .modal-players > table td:first-child {
    min-width: 120px;
    font-size: 14px;
  }

  .modal-players > table td:nth-child(2) img {
    width: 50px;
    height: 50px;
  }

  .modal-players > table td:last-child {
    font-size: 14px;
  }
}
</style>
