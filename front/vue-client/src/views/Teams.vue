<template>
  <div class="teams-page">
    <div class="page-header">
      <h1>Мои команды</h1>
    </div>

    <div v-if="showTeamForm" class="team-form-overlay">
      <div class="team-form-container">
        <div class="team-form">
          <div class="form-header">
            <h3>Создать команду</h3>
            <button @click="closeTeamForm" class="close-btn">×</button>
          </div>

          <form @submit.prevent="createTeam">
            <div class="form-group">
              <label>Название команды:</label>
              <input
                v-model="newTeam.name"
                type="text"
                required
                placeholder="Введите название команды"
                class="team-name-input"
              />
            </div>

            <div class="selected-players-section">
              <h4>Выбранные игроки ({{ selectedPlayers.length }}/7)</h4>
              <div
                v-if="selectedPlayers.length > 0"
                class="selected-players-list"
              >
                <div
                  v-for="player in selectedPlayers"
                  :key="player.id"
                  class="selected-player"
                >
                  <div class="player-info">
                    <span class="player-name">{{ player.name }}</span>
                    <span class="player-position">{{ player.position }}</span>
                    <span class="player-cost">
                      <div class="d-flex">
                        <div>{{ player.cost.toLocaleString() }}</div>
                        <div>
                          <img
                            width="20px"
                            height="20px"
                            src="http://localhost:3000/img/basket-coin.png"
                          />
                        </div>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="no-players-selected">
                <p>Выберите игроков из списка ниже</p>
                <p class="hint">Минимум 1 игрок, максимум 7 игроков</p>
              </div>
            </div>

            <div class="team-budget">
              <div class="budget-item">
                <span class="budget-label">Бюджет:</span>
                <span class="budget-value">
                  <div class="d-flex">
                    <div>{{ budget.toLocaleString() }}</div>
                    <div>
                      <img
                        width="20px"
                        height="20px"
                        src="http://localhost:3000/img/basket-coin.png"
                      />
                    </div>
                  </div>
                </span>
              </div>
              <div class="budget-item">
                <span class="budget-label">Общая стоимость:</span>
                <span class="budget-value">
                  <div class="d-flex">
                    <div>{{ totalCost }}</div>
                    <div>
                      <img
                        width="20px"
                        height="20px"
                        src="http://localhost:3000/img/basket-coin.png"
                      />
                    </div>
                  </div>
                </span>
              </div>
              <div
                class="budget-item"
                :class="{ 'budget-warning': totalCost > BUDGET_LIMIT }"
              >
                <span class="budget-label">Остаток:</span>
                <span class="budget-value">
                  <div class="d-flex">
                    <div>{{ (budget - totalCost).toLocaleString() }}</div>
                    <div>
                      <img
                        width="20px"
                        height="20px"
                        src="http://localhost:3000/img/basket-coin.png"
                      />
                    </div>
                  </div>
                </span>
              </div>
            </div>

            <!-- Список доступных игроков ВНУТРИ модального окна -->
            <div class="available-players-section">
              <div class="section-header">
                <h4>Доступные игроки</h4>
                <div class="players-filters">
                  <select
                    v-model="playerFilters.position"
                    @change="loadAvailablePlayers"
                  >
                    <option value="">Все позиции</option>
                    <option value="PG">Point Guard (PG)</option>
                    <option value="SG">Shooting Guard (SG)</option>
                    <option value="SF">Small Forward (SF)</option>
                    <option value="PF">Power Forward (PF)</option>
                    <option value="C">Center (C)</option>
                  </select>

                  <input
                    v-model="playerFilters.search"
                    type="text"
                    placeholder="Поиск по имени..."
                    @input="debouncedSearch"
                    class="search-input"
                  />
                </div>
              </div>

              <div v-if="availablePlayersLoading" class="loading">
                Загрузка игроков...
              </div>

              <div v-else class="available-players-grid">
                <div
                  v-for="player in availablePlayers"
                  :key="player.id"
                  :class="[
                    'player-card',
                    {
                      selected: isPlayerSelected(player),
                      'over-budget': !canAddPlayer(player),
                      disabled:
                        isPlayerSelected(player) || !canAddPlayer(player),
                    },
                  ]"
                  @click="togglePlayer(player)"
                >
                  <div class="player-header">
                    <h5>{{ player.name }}</h5>
                    <span
                      class="position-badge"
                      :class="player.position.toLowerCase()"
                    >
                      {{ player.position }}
                    </span>
                  </div>

                  <div class="player-stats">
                    <!-- <div class="stat">
                      <span class="label">Рост:</span>
                      <span class="value">{{ player.height }}м</span>
                    </div> -->
                    <div class="stat">
                      <span class="label">Очки:</span>
                      <span class="value">{{ player.points }}</span>
                    </div>
                    <div class="stat">
                      <span class="label">Подборы:</span>
                      <span class="value">{{ player.rebounds }}</span>
                    </div>
                    <div class="stat">
                      <span class="label">Передачи:</span>
                      <span class="value">{{ player.assists }}</span>
                    </div>
                  </div>

                  <div class="player-footer">
                    <div class="player-cost">
                      <div class="d-flex">
                        <div>{{ player.cost.toLocaleString() }}</div>
                        <div>
                          <img
                            width="20px"
                            height="20px"
                            src="http://localhost:3000/img/basket-coin.png"
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="isPlayerSelected(player)"
                      class="selected-indicator"
                    >
                      ✓ Выбран
                    </div>
                    <div
                      v-else-if="!canAddPlayer(player)"
                      class="budget-warning-text"
                    >
                      Бюджет превышен
                    </div>
                    <div v-else class="add-indicator">+ Добавить</div>
                  </div>
                </div>
              </div>

              <div
                v-if="availablePlayers.length === 0 && !availablePlayersLoading"
                class="no-players-found"
              >
                <p>Игроки не найдены</p>
                <p class="hint">Попробуйте изменить параметры фильтрации</p>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="closeTeamForm" class="cancel-btn">
                Отмена
              </button>
              <button
                type="submit"
                :disabled="!canCreateTeam || creatingTeam"
                class="submit-btn"
              >
                {{ creatingTeam ? "Создание..." : "Создать команду" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">Загрузка команд...</div>

    <div v-else-if="teams.length > 0" class="teams-list">
      <div v-for="team in teams" :key="team.id" class="team-card">
        <div class="team-header">
          <h3>{{ team.name }}</h3>
          <div class="team-stats">
            <span class="points">{{ team.total_points }} очков</span>
            <span class="budget"
              >Бюджет:
              <div class="d-flex">
                <div>{{ team.budget }}</div>
                <div>
                  <img
                    width="20px"
                    height="20px"
                    src="http://localhost:3000/img/basket-coin.png"
                  />
                </div>
              </div>
            </span>
          </div>
        </div>

        <div class="players-list">
          <h4>Состав команды ({{ team.players?.length || 0 }} игроков)</h4>
          <div
            v-if="team.players && team.players.length > 0"
            class="players-grid"
          >
            <div
              v-for="player in team.players"
              :key="player.id"
              class="team-player"
            >
              <div class="player-info">
                <img
                  v-if="player.avatar"
                  :src="getUrl(player.avatar)"
                  :alt="player.name"
                  class="player-avatar"
                />
              </div>
              <div
                class="player-info"
                style="
                  padding: 10px;
                  align-items: center;
                  justify-content: center;
                "
              >
                <span class="position">{{ player.position }}</span>

                <strong>{{ player.name }}</strong>
              </div>
              <div class="player-stats">
                <div>
                  <span>{{ player.points }}</span> <span>очки</span>
                </div>
                <div>
                  <span>{{ player.rebounds }}</span
                  ><span> подборы</span>
                </div>
                <div>
                  <span>{{ player.assists }}</span
                  ><span> передачи</span>
                </div>
                <div>
                  <span>{{ player.fouls }} </span><span> фолы</span>
                </div>
                <div>
                  <span>{{ player.steals }}</span> <span> перехваты</span>
                </div>
                <div>
                  <span>{{ player.turnovers }}</span> <span> потери</span>
                </div>
                <div>
                  <span>{{ player.blocks }}</span> <span> блоки</span>
                </div>
              </div>
              <!--<span>
                  <div class="d-flex">
                    <div>{{ player.cost?.toLocaleString() }}</div>
                    <div>
                      <img
                        width="20px"
                        height="20px"
                        src="http://localhost:3000/img/basket-coin.png"
                      />
                    </div>
                  </div>
                </span>-->
            </div>
          </div>
          <div v-else class="no-players">В команде пока нет игроков</div>
        </div>
      </div>
    </div>

    <div v-else class="no-teams">
      <p>У вас пока нет команд</p>
      <button @click="showTeamForm = true" class="create-team-btn">
        Создать первую команду
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();

const teams = ref([]);
const loading = ref(false);
const showTeamForm = ref(false);
const creatingTeam = ref(false);

const availablePlayers = ref([]);
const availablePlayersLoading = ref(false);
const selectedPlayers = ref([]);

const newTeam = ref({
  name: "",
});

const playerFilters = ref({
  position: "",
  search: "",
});

const BUDGET_LIMIT = 300;

// Computed properties
const totalCost = computed(() => {
  return selectedPlayers.value.reduce(
    (sum, player) => sum + parseFloat(player.cost || 0),
    0
  );
});

const budget = computed(() => BUDGET_LIMIT);

const canCreateTeam = computed(() => {
  return (
    newTeam.value.name.trim() &&
    selectedPlayers.value.length > 0 &&
    selectedPlayers.value.length <= 12 &&
    totalCost.value <= BUDGET_LIMIT
  );
});

const loadTeams = async () => {
  loading.value = true;
  try {
    const response = await api.get("/team");

    teams.value = response.data;
    for (var j = 0; j < teams.value.length; j++) {
      teams.value[j].budget = 0;
      for (var i = 0; i < teams.value[j].players.length; i++) {
        teams.value[j].budget += parseInt(teams.value[j].players[i].cost);
      }
    }
  } catch (error) {
    console.error("Ошибка загрузки команд:", error);
  } finally {
    loading.value = false;
  }
};

const loadAvailablePlayers = async () => {
  availablePlayersLoading.value = true;
  try {
    const params = {
      limit: 50,
      ...playerFilters.value,
    };

    // Удаляем пустые параметры
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });

    const response = await api.get("/players", { params });
    availablePlayers.value = response.data.players || response.data;
  } catch (error) {
    console.error("Ошибка загрузки игроков:", error);
    availablePlayers.value = [];
  } finally {
    availablePlayersLoading.value = false;
  }
};

const createTeam = async () => {
  if (!canCreateTeam.value) return;

  creatingTeam.value = true;
  try {
    const teamData = {
      name: newTeam.value.name,
      playerIds: selectedPlayers.value.map((player) => player.id),
    };

    const response = await api.post("/team", teamData);

    closeTeamForm();

    await loadTeams();

    alert("Команда успешно создана!");
  } catch (error) {
    console.error("Ошибка создания команды:", error);
    alert(error.response?.data?.error || "Ошибка создания команды");
  } finally {
    creatingTeam.value = false;
  }
};

const closeTeamForm = () => {
  showTeamForm.value = false;
  newTeam.value.name = "";
  selectedPlayers.value = [];
  playerFilters.value = {
    position: "",
    search: "",
  };
};

const togglePlayer = (player) => {
  const isSelected = isPlayerSelected(player);

  if (isSelected) {
    removeFromTeam(player);
  } else {
    addToTeam(player);
  }
};

const addToTeam = (player) => {
  if (selectedPlayers.value.length >= 7) {
    alert("В команде не может быть больше 7 игроков");
    return;
  }

  if (totalCost.value + parseFloat(player.cost) > BUDGET_LIMIT) {
    alert("Превышен бюджет команды");
    return;
  }

  if (!isPlayerSelected(player)) {
    selectedPlayers.value.push(player);
  }
};

const removeFromTeam = (player) => {
  selectedPlayers.value = selectedPlayers.value.filter(
    (p) => p.id !== player.id
  );
};

const isPlayerSelected = (player) => {
  return selectedPlayers.value.some((p) => p.id === player.id);
};

const canAddPlayer = (player) => {
  return totalCost.value + parseFloat(player.cost) <= BUDGET_LIMIT;
};

const viewTeam = (teamId) => {
  router.push(`/team/${teamId}`);
};

const deleteTeam = async (teamId) => {
  if (!confirm("Вы уверены, что хотите удалить команду?")) return;

  try {
    await api.delete(`/team/${teamId}`);
    await loadTeams();
    alert("Команда удалена");
  } catch (error) {
    console.error("Ошибка удаления команды:", error);
    alert(error.response?.data?.error || "Ошибка удаления команды");
  }
};

let searchTimeout = null;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadAvailablePlayers();
  }, 500);
};

// Lifecycle
onMounted(() => {
  loadTeams();
});

watch(showTeamForm, (newVal) => {
  if (newVal) {
    loadAvailablePlayers();
  }
});

const getUrl = (avatar) => {
  if (avatar.includes("http")) {
    return `${avatar}`;
  } else {
    return `http://localhost:3000${avatar}`;
  }
};
</script>

<style scoped>
.teams-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-header h1 {
  color: #2c3e50;
  margin: 0;
}

.create-team-btn {
  background: #27ae60;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  font-weight: 500;
}

.create-team-btn:hover {
  background: #219a52;
}

.team-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  z-index: 1000;
}

.team-form-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.team-form {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #ecf0f1;
}

.form-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #7f8c8d;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #e74c3c;
}

.form-group {
  margin-bottom: 2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.team-name-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1.1rem;
  transition: border-color 0.3s;
}

.team-name-input:focus {
  outline: none;
  border-color: #3498db;
}

/* Секция выбранных игроков */
.selected-players-section {
  margin-bottom: 2rem;
}

.selected-players-section h4 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.selected-players-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
  max-height: 200px;
  overflow-y: auto;
}

.selected-player {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #27ae60;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.player-name {
  font-weight: 600;
  color: #2c3e50;
}

.player-position {
  background: #3498db;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.player-cost {
  font-weight: 600;
  color: #27ae60;
}

.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: background-color 0.3s;
}

.remove-btn:hover {
  background: #c0392b;
}

.no-players-selected {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #7f8c8d;
}

.hint {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  opacity: 0.7;
}

/* Бюджет команды */
.team-budget {
  background: #ecf0f1;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.budget-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.budget-item:last-child {
  margin-bottom: 0;
}

.budget-label {
  font-weight: 500;
  color: #2c3e50;
}

.budget-value {
  font-weight: 600;
  color: #2c3e50;
}

.budget-warning .budget-value {
  color: #e74c3c;
}

/* Секция доступных игроков */
.available-players-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h4 {
  margin: 0;
  color: #2c3e50;
}

.players-filters {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.players-filters select,
.players-filters input {
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 6px;
  font-size: 1rem;
}

.search-input {
  width: 250px;
}

.available-players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.player-card {
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  border: 2px solid #e1e8ed;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.player-card:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #3498db;
}

.player-card.selected {
  border-color: #27ae60;
  background: #f8fff9;
}

.player-card.over-budget:not(.selected) {
  opacity: 0.6;
  cursor: not-allowed;
}

.player-card.disabled {
  cursor: not-allowed;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.player-header h5 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.position-badge {
  padding: 0.3rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}

.position-badge.pg {
  background: #e74c3c;
}
.position-badge.sg {
  background: #3498db;
}
.position-badge.sf {
  background: #2ecc71;
}
.position-badge.pf {
  background: #f39c12;
}
.position-badge.c {
  background: #9b59b6;
}

.player-stats {
  display: flex;
  flex-wrap: wrap;
  color: #fff;
  gap: 0.5rem;
  margin-bottom: 1rem;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat .label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.stat .value {
  font-weight: 600;
  color: #2c3e50;
}

.player-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.player-cost {
  font-size: 1.2rem;
  font-weight: bold;
  color: #27ae60;
}

.selected-indicator {
  background: #27ae60;
  color: white;
  padding: 0.3rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.budget-warning-text {
  background: #e74c3c;
  color: white;
  padding: 0.3rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.add-indicator {
  color: #3498db;
  font-size: 0.8rem;
  font-weight: 500;
}

.no-players-found {
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #7f8c8d;
}

/* Действия формы */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 2px solid #ecf0f1;
}

.cancel-btn {
  background: #95a5a6;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.3s;
}

.cancel-btn:hover {
  background: #7f8c8d;
}

.submit-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #2980b9;
}

.submit-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

/* Остальные стили (список команд и т.д.) остаются такими же */
.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #7f8c8d;
}

.teams-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.team-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.team-header h3 {
  margin: 0;
  color: #2c3e50;
}

.team-stats {
  display: flex;
  gap: 1rem;
}

.points {
  color: #27ae60;
  font-weight: bold;
}

.budget {
  color: #7f8c8d;
}

.players-list h4 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 1rem;
}

.team-player {
  background: #333;
  border-radius: 10px;
}

.player-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.position {
  background: #3498db;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.player-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.team-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.view-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.no-teams {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}

.no-teams p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .teams-page {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .team-form {
    padding: 1rem;
  }

  .form-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
  }

  .players-filters {
    flex-direction: column;
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .available-players-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .team-header {
    flex-direction: column;
    align-items: stretch;
  }

  .team-stats {
    justify-content: space-between;
  }
}
.d-flex,
.d-flex div {
  display: flex;
  align-items: center;
  gap: 10px;
}
.page-header h1 {
  color: #fff;
  text-align: center;
}
.player-avatar {
  width: 100%;
  height: 280px;
  object-fit: cover;
}
.player-stats div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 40%;
  text-align: center;
}
.player-stats div span {
  display: block;
}
</style>
