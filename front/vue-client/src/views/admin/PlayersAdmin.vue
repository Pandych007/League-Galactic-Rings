<template>
  <div class="players-admin">
    <div class="page-header">
      <h2>Управление игроками</h2>
      <button @click="showAddPlayerForm = true" class="add-player-btn">
        Добавить игрока
      </button>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ totalPlayers }}</div>
        <div class="stat-label">Всего игроков</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ activePLayers }}</div>
        <div class="stat-label">Активных</div>
      </div>
    </div>

    <!-- Модальное окно формы -->
    <div v-if="showAddPlayerForm || editingPlayer" class="modal-form-overlay">
      <div class="modal-form-container">
        <div class="modal-form-card">
          <div class="modal-form-header">
            <h3 class="modal-form-title">
              {{
                editingPlayer
                  ? "Редактировать игрока"
                  : "Добавить нового игрока"
              }}
            </h3>
            <button @click="closeForm" class="modal-form-close-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>

          <form @submit.prevent="savePlayer" class="modal-form-content">
            <div class="modal-form-scroll">
              <!-- Основная информация -->
              <div class="modal-form-section">
                <h4 class="modal-section-title">
                  <svg
                    class="modal-section-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                    <path
                      d="M6 20V19C6 16.2386 8.23858 14 11 14H13C15.7614 14 18 16.2386 18 19V20"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                  Основная информация
                </h4>

                <div class="modal-input-group">
                  <label class="modal-input-label">
                    <span class="label-text">Имя игрока</span>
                    <span class="required-asterisk">*</span>
                  </label>
                  <div class="modal-input-wrapper">
                    <input
                      type="text"
                      v-model="playerForm.name"
                      required
                      placeholder="Введите полное имя"
                      :class="{ 'modal-input-error': errors.name }"
                      class="modal-input"
                    />
                  </div>
                  <span v-if="errors.name" class="modal-error-message">{{
                    errors.name
                  }}</span>
                </div>

                <div class="modal-form-row">
                  <div v-if="!editingPlayer" class="modal-input-group">
                    <label class="modal-input-label">
                      <span class="label-text">Позиция</span>
                      <span class="required-asterisk">*</span>
                    </label>
                    <div class="modal-select-wrapper">
                      <select
                        v-model="playerForm.position"
                        required
                        class="modal-select"
                        id="editPosition"
                      >
                        <option value="">Все Позиции</option>
                        <option value="PG">Разыгрывающий защитник</option>
                        <option value="SG">Атакующий защитник</option>
                        <option value="SF">Лёгкий форвард</option>
                        <option value="PF">Тяжёлый форвард</option>
                        <option value="C">Центровой</option>
                      </select>
                      <svg
                        class="select-chevron"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div>
                    <span v-if="errors.position" class="modal-error-message">{{
                      errors.position
                    }}</span>
                  </div>

                  <div class="modal-input-group">
                    <label class="modal-input-label">
                      <span class="label-text">Аватарка</span>
                    </label>
                    <div class="modal-input-wrapper">
                      <input
                        type="text"
                        v-model="playerForm.avatar"
                        placeholder="Ссылка на изображение"
                        class="modal-input"
                        style="height: 24px"
                      />
                    </div>
                  </div>

                  <div class="modal-input-group">
                    <label class="modal-input-label">
                      <span class="label-text">Стоимость</span>
                      <span class="required-asterisk">*</span>
                    </label>
                    <div class="modal-input-wrapper with-prefix">
                      <span class="input-prefix"
                        ><img
                          src="http://localhost:3000/img/basket-coin.png"
                          width="24px"
                          alt=""
                      /></span>
                      <input
                        type="number"
                        v-model="playerForm.cost"
                        placeholder="0.0"
                        step="0.1"
                        min="0"
                        :class="{ 'modal-input-error': errors.cost }"
                        class="modal-input"
                      />
                    </div>
                    <span v-if="errors.cost" class="modal-error-message">{{
                      errors.cost
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Статистика - ИСПРАВЛЕННАЯ -->
              <div class="modal-form-section">
                <h4 class="modal-section-title">
                  <svg
                    class="modal-section-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 19C9 19 9 15 12 15C15 15 15 19 15 19"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path
                      d="M4 19H20"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                    <path d="M12 15V4" stroke="currentColor" stroke-width="2" />
                  </svg>
                  Статистика
                </h4>

                <div class="modal-stats-grid">
                  <!-- Очки -->
                  <div class="modal-stat-group">
                    <label class="modal-stat-label">
                      <span class="stat-icon">🏀</span>
                      <span class="stat-label-text">Очки</span>
                    </label>
                    <input
                      type="number"
                      v-model="playerForm.points"
                      placeholder="0"
                      class="modal-stat-input"
                    />
                  </div>

                  <!-- Подборы -->
                  <div class="modal-stat-group">
                    <label class="modal-stat-label">
                      <span class="stat-icon">↕️</span>
                      <span class="stat-label-text">Подборы</span>
                    </label>
                    <input
                      type="number"
                      v-model="playerForm.rebounds"
                      placeholder="0"
                      class="modal-stat-input"
                    />
                  </div>

                  <!-- Передачи -->
                  <div class="modal-stat-group">
                    <label class="modal-stat-label">
                      <span class="stat-icon">🎯</span>
                      <span class="stat-label-text">Передачи</span>
                    </label>
                    <input
                      type="number"
                      v-model="playerForm.assists"
                      placeholder="0"
                      class="modal-stat-input"
                    />
                  </div>

                  <!-- Фолы -->
                  <div class="modal-stat-group">
                    <label class="modal-stat-label">
                      <span class="stat-icon">⚠️</span>
                      <span class="stat-label-text">Фолы</span>
                    </label>
                    <input
                      type="number"
                      v-model="playerForm.fouls"
                      placeholder="0"
                      class="modal-stat-input"
                    />
                  </div>

                  <!-- Перехваты -->
                  <div class="modal-stat-group">
                    <label class="modal-stat-label">
                      <span class="stat-icon">✋</span>
                      <span class="stat-label-text">Перехваты</span>
                    </label>
                    <input
                      type="number"
                      v-model="playerForm.steals"
                      placeholder="0"
                      class="modal-stat-input"
                    />
                  </div>

                  <!-- Потери -->
                  <div class="modal-stat-group">
                    <label class="modal-stat-label">
                      <span class="stat-icon">↩️</span>
                      <span class="stat-label-text">Потери</span>
                    </label>
                    <input
                      type="number"
                      v-model="playerForm.turnovers"
                      placeholder="0"
                      class="modal-stat-input"
                    />
                  </div>

                  <!-- Блок-шоты -->
                  <div class="modal-stat-group">
                    <label class="modal-stat-label">
                      <span class="stat-icon">🛡️</span>
                      <span class="stat-label-text">Блок-шоты</span>
                    </label>
                    <input
                      type="number"
                      v-model="playerForm.blocks"
                      placeholder="0"
                      class="modal-stat-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Кнопки формы -->
            <div class="modal-form-actions">
              <button type="button" @click="closeForm" class="modal-cancel-btn">
                Отмена
              </button>
              <button
                type="submit"
                :disabled="saveingPlayer"
                class="modal-submit-btn"
              >
                <span v-if="saveingPlayer" class="loading-spinner"></span>
                <span class="btn-text">
                  {{
                    saveingPlayer
                      ? "Сохранение..."
                      : editingPlayer
                      ? "Сохранить изменения"
                      : "Добавить игрока"
                  }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Таблица игроков (без изменений) -->
    <div class="players-table-container">
      <div class="loading" v-if="loading">Загрузка игроков...</div>
      <div v-else class="table-responsive">
        <table class="players-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Позиция</th>
              <th>статус</th>
              <th>очки</th>
              <th>подборы</th>
              <!--rebounds -->
              <th>передачи</th>
              <!--assists -->
              <th>фолы</th>
              <!--fouls -->
              <th>перехваты</th>
              <!--steals-->
              <th>потери</th>
              <!--turnovers-->
              <th>блок-шоты</th>
              <!--blocks-->
              <th>действия</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="player in players"
              :key="player.id"
              :class="{ inactive: !player.is_active }"
            >
              <td class="id-cell">{{ player.id }}</td>
              <td class="name-cell">{{ player.name }}</td>
              <td>{{ player.position }}</td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    player.is_active ? 'active' : 'inactive',
                  ]"
                >
                  {{ player.is_active ? "Активен" : "Неактивен" }}
                </span>
              </td>
              <td>{{ player.points }}</td>
              <td>{{ player.rebounds }}</td>
              <td>{{ player.assists }}</td>
              <td>{{ player.fouls }}</td>
              <td>{{ player.steals }}</td>
              <td>{{ player.turnovers }}</td>
              <td>{{ player.blocks }}</td>
              <td class="actions-cell">
                <button @click="editPlayer(player)" class="action-btn edit-btn">
                  Редактировать
                </button>
                <button
                  @click="togglePlayerStatus(player)"
                  class="action-btn status-btn"
                >
                  {{ player.is_active ? "Деактивировать" : "Активировать" }}
                </button>
                <button
                  @click="deletePlayer(player)"
                  class="action-btn delete-btn"
                >
                  Удалить
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="totalPages > 1" class="pagination">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="pagination-btn"
        >
          Назад
        </button>
        <div class="pagination-pages">
          <span
            v-for="page in visiblePages"
            :key="page"
            :class="['page-number', { active: page == currentPage }]"
            >{{ page }}</span
          >
        </div>
        <button
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          class="pagination-btn"
        >
          Вперед
        </button>
      </div>
      <div v-if="players.length === 0 && !loading" class="empty-state">
        <h3>Игроки не найдены</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import api from "../../services/api";

const players = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = ref(20);

const searchQuery = ref("");
const statusFilter = ref("");
const positionFilter = ref("");

const showAddPlayerForm = ref(false);
const editingPlayer = ref(null); // Изменено на null для хранения объекта игрока
const saveingPlayer = ref(false);

const playerForm = ref({
  name: "",
  position: "",
  avatar: "",
  cost: 0,
  points: 0,
  rebounds: 0,
  assists: 0,
  fouls: 0,
  steals: 0,
  turnovers: 0,
  blocks: 0,
  is_active: true,
});

const errors = ref({});

const totalPlayers = computed(() => players.value.length);

const activePLayers = computed(() => {
  return players.value.filter((player) => player.is_active).length;
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});
let searchTimeout = null;

const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    loadPlayers();
  }, 500);
};

const loadPlayers = async () => {
  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      search: searchQuery.value,
      position: positionFilter.value,
      status: statusFilter.value,
    };

    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });

    const response = await api.get("/players", { params });
    players.value = response.data.players || response.data;
    totalPages.value = response.data.totalPages || 1;
    totalPlayers.value = response.data.totalPlayers || players.value.length;
    console.log(players.value);
  } catch (error) {
    console.error(error);
    alert("Ошибка загрузки данных");
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  currentPage.value = page;
  loadPlayers();
};

const validateForm = () => {
  errors.value = {};

  if (!playerForm.value.name.trim()) {
    errors.value.name = "Имя игрока обязательно";
  }

  /*if (!playerForm.value.position) {
    errors.value.position = "Выберите позицию";
  }*/

  if (!playerForm.value.cost && playerForm.value.cost !== 0) {
    errors.value.cost = "Стоимость игрока обязательна";
  }
  console.log(errors.value);
  return Object.keys(errors.value).length === 0;
};

const savePlayer = async () => {
  if (!validateForm()) {
    return;
  }
  saveingPlayer.value = true;

  try {
    const playerData = { ...playerForm.value };
    if (editingPlayer.value) {
      // Редактирование
      await api.put(`/players/${editingPlayer.value.id}`, playerData);
      alert("Игрок успешно обновлен");
    } else {
      console.log(playerData);
      await api.post("/players", playerData);
      alert("Игрок успешно добавлен");
    }

    closeForm();
    loadPlayers();
  } catch (error) {
    console.error(error);
    alert("Ошибка сохранения");
  } finally {
    saveingPlayer.value = false;
  }
};

const togglePlayerStatus = async (player) => {
  try {
    const newStatus = !player.is_active;
    await api.put(`/players/${player.id}`, { is_active: newStatus });

    player.is_active = newStatus;
    alert(`Игрок ${newStatus ? "активирован" : "деактивирован"}`);
  } catch (error) {
    console.log(error);
    alert("Ошибка изменения статуса");
  }
};

const deletePlayer = async (player) => {
  if (!confirm(`Удалить игрока "${player.name}"?`)) {
    return;
  }
  try {
    await api.delete(`/players/${player.id}`);
    alert("Игрок успешно удален");
    loadPlayers();
  } catch (error) {
    console.error(error);
    alert("Ошибка удаления");
  }
};

const closeForm = () => {
  showAddPlayerForm.value = false;
  editingPlayer.value = null;
  playerForm.value = {
    name: "",
    position: "",
    avatar: "",
    cost: 0,
    points: 0,
    rebounds: 0,
    assists: 0,
    fouls: 0,
    steals: 0,
    turnovers: 0,
    blocks: 0,
    is_active: true,
  };
  errors.value = {};
};
const editPlayer = (player) => {
  editingPlayer.value = player;

  //select.value = player.position;

  playerForm.value = {
    name: player.name,
    //position: player.position,
    cost: player.cost,
    is_active: player.is_active,
    avatar: player.avatar,
    points: player.points,
    rebounds: player.rebounds,
    assists: player.assists,
    fouls: player.fouls,
    steals: player.steals,
    turnovers: player.turnovers,
    blocks: player.blocks,
  };
  showAddPlayerForm.value = true;
};
onMounted(() => {
  loadPlayers();
});
watch(currentPage, loadPlayers);
</script>

<style scoped>
/* ВСЕ СУЩЕСТВУЮЩИЕ СТИЛИ ДЛЯ ТАБЛИЦЫ ОСТАЮТСЯ БЕЗ ИЗМЕНЕНИЙ */

.players-admin {
  font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f8fafc;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.page-header h2 {
  color: #1e293b;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.add-player-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
}

.add-player-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.3);
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
}

.add-player-btn:active {
  transform: translateY(0);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #f1f5f9;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.stat-value {
  font-size: 36px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.players-table-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  overflow: hidden;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #64748b;
  font-size: 18px;
  font-weight: 500;
}

.table-responsive {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.players-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

.players-table thead {
  background-color: #f8fafc;
}

.players-table th {
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.players-table tbody tr {
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f1f5f9;
}

.players-table tbody tr:hover {
  background-color: #f8fafc;
}

.players-table tbody tr.inactive {
  background-color: #fef2f2;
}

.players-table tbody tr.inactive:hover {
  background-color: #fee2e2;
}

.players-table td {
  padding: 16px 12px;
  color: #334155;
  font-size: 14px;
  vertical-align: middle;
}

.id-cell {
  font-weight: 600;
  color: #3b82f6;
  font-family: monospace;
}

.name-cell {
  font-weight: 600;
  color: #1e293b;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.active {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background-color: #fee2e2;
  color: #991b1b;
}

.actions-cell {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.edit-btn {
  background-color: #dbeafe;
  color: #1e40af;
}

.edit-btn:hover {
  background-color: #bfdbfe;
  transform: translateY(-1px);
}

.status-btn {
  background-color: #f0f9ff;
  color: #0369a1;
}

.status-btn:hover {
  background-color: #e0f2fe;
  transform: translateY(-1px);
}

.delete-btn {
  background-color: #fee2e2;
  color: #b91c1c;
}

.delete-btn:hover {
  background-color: #fecaca;
  transform: translateY(-1px);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
  gap: 16px;
}

.pagination-btn {
  padding: 10px 20px;
  background-color: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #e2e8f0;
  color: #1e293b;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 8px;
}

.page-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-number:hover:not(.active) {
  background-color: #f1f5f9;
  color: #334155;
}

.page-number.active {
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #475569;
}

.empty-state p {
  font-size: 16px;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .players-admin {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .page-header h2 {
    font-size: 24px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .players-admin {
    padding: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .players-table-container {
    padding: 16px;
  }

  .actions-cell {
    flex-direction: column;
  }

  .pagination {
    flex-direction: column;
    gap: 12px;
  }

  .pagination-pages {
    flex-wrap: wrap;
    justify-content: center;
  }
}

/* НОВЫЕ СТИЛИ ТОЛЬКО ДЛЯ МОДАЛЬНОГО ОКНА ФОРМЫ */

.modal-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-form-container {
  max-width: 800px;
  width: 100%;
  max-height: 85vh;
  animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.modal-form-header {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-form-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: white;
  letter-spacing: -0.5px;
}

.modal-form-close-btn {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-form-close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: rotate(90deg);
}

.modal-form-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8fafc;
}

.modal-form-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  max-height: calc(85vh - 184px);
}

.modal-form-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.modal-section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

.modal-section-icon {
  color: #4f46e5;
  stroke-width: 2;
  flex-shrink: 0;
}

.modal-input-group {
  margin-bottom: 20px;
}

.modal-input-label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.label-text {
  line-height: 1;
}

.required-asterisk {
  color: #ef4444;
  font-size: 16px;
  line-height: 1;
}

.modal-input-wrapper {
  position: relative;
}

.modal-input {
  width: 84%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.modal-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.modal-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.modal-input-error {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.modal-input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.modal-error-message {
  display: block;
  font-size: 13px;
  color: #ef4444;
  margin-top: 6px;
  font-weight: 500;
}

.modal-form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 768px) {
  .modal-form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.modal-select-wrapper {
  position: relative;
}

.modal-select {
  height: 55px;

  width: 100%;
  padding: 14px 16px;
  padding-right: 40px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
  background: white;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.modal-select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.select-chevron {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
}

.with-prefix {
  display: flex;
}

.input-prefix {
  padding: 14px 0 14px 16px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-right: none;
  border-radius: 10px 0 0 10px;
  font-size: 15px;
  font-weight: 600;
  color: #475569;
  display: flex;
  align-items: center;
}

.with-prefix .modal-input {
  border-radius: 0 10px 10px 0;
  border-left: none;
}

/* ИСПРАВЛЕННЫЕ СТИЛИ ДЛЯ СТАТИСТИКИ */
.modal-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .modal-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .modal-stats-grid {
    grid-template-columns: 1fr;
  }
}

.modal-stat-group {
  background: #f8fafc;
  padding: 16px;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.modal-stat-group:focus-within {
  border-color: #4f46e5;
  background: white;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.modal-stat-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-icon {
  font-size: 18px;
}

.stat-label-text {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-stat-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
  background: white;
  transition: all 0.3s ease;
}

.modal-stat-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.modal-stat-input::placeholder {
  color: #cbd5e1;
  font-weight: 400;
}

/* Улучшенные стили для статистики - исправлены отступы и выравнивание */
.modal-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.modal-stat-group {
  background: #f8fafc;
  padding: 14px;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.modal-stat-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-stat-input {
  width: 84%;
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
  background: white;
  transition: all 0.3s ease;
  height: 44px;
}

.modal-form-actions {
  display: flex;
  gap: 16px;
  padding: 24px 32px;
  background: white;
  border-top: 1px solid #f1f5f9;
  margin-top: auto;
}

.modal-cancel-btn {
  flex: 1;
  padding: 16px 24px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  color: #64748b;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-cancel-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.modal-cancel-btn:active {
  transform: scale(0.98);
}

.modal-submit-btn {
  flex: 1;
  padding: 16px 24px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.modal-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
}

.modal-submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.modal-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-text {
  position: relative;
  z-index: 1;
}

.loading-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spinnerSpin 1s ease-in-out infinite;
}

@keyframes spinnerSpin {
  to {
    transform: rotate(360deg);
  }
}

/* Адаптивность для модального окна */
@media (max-width: 768px) {
  .modal-form-container {
    max-width: 95%;
  }

  .modal-form-header {
    padding: 20px 24px;
  }

  .modal-form-title {
    font-size: 20px;
  }

  .modal-form-scroll {
    padding: 20px;
  }

  .modal-form-section {
    padding: 20px;
  }

  .modal-form-actions {
    padding: 20px 24px;
    flex-direction: column;
  }
}
</style>
