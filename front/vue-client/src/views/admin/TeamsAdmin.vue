<!-- <template>
  <div class="teams-admin">
    <div class="page-header">
      <h2>Управление командами</h2>
    </div>
    <div class="teams-table-container">
      <div v-if="loading" class="loading">Загрузка команд</div>
      <div v-else class="table-responsive">
        <table class="teams-table">
          <tr>
            <th>ID</th>
            <th>Название команды</th>
            <th>Создатель команды</th>
            <th></th>
          </tr>
          <tr v-for="team in teams" :key="team.id">
            <td>{{ team.id }}</td>
            <td>{{ team.name }}</td>
            <td></td>
            <td>
              <button @click="viewTeamPlayers(team)" class="players-btn">
                Просмотреть игроков
              </button>
              <button
                @click="toggleTeamStatus(team)"
                class="action-btn status-btn"
              >
                {{ team.is_active ? "Деактивировать" : "Активировать" }}
              </button>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import api from "../../services/api";

const teams = ref([]);
const loading = ref(false);

const loadTeams = async () => {
  loading.value = true;
  try {
    const response = await api.get("/team/admin/getAllTeams");
    teams.value = response.data.teams || response.data;
    console.log(teams.value);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadTeams();
});
</script> -->

<template>
  <div class="teams-admin">
    <div class="page-header">
      <div class="header-content">
        <h2><i class="icon">👥</i>Управление командами</h2>
        <div class="header-info">
          <span class="count-badge">{{ teams.length }} команд</span>
        </div>
      </div>
    </div>

    <div class="teams-table-container">
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <div class="loading-text">Загрузка команд...</div>
      </div>

      <div v-else class="table-wrapper">
        <div class="table-responsive">
          <table class="teams-table">
            <thead>
              <tr class="table-header">
                <th class="col-id">
                  <div class="th-content">
                    <span>ID</span>
                  </div>
                </th>
                <th class="col-name">
                  <div class="th-content">
                    <span>Название команды</span>
                  </div>
                </th>
                <th class="col-creator">
                  <div class="th-content">
                    <span>Создатель команды</span>
                  </div>
                </th>
                <th class="col-actions">
                  <div class="th-content">
                    <span>Действия</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="team in teams"
                :key="team.id"
                class="team-row"
                :class="{ 'inactive-team': !team.is_active }"
              >
                <td class="cell-id">
                  <span class="team-id">#{{ team.id }}</span>
                </td>
                <td class="cell-name">
                  <div class="team-info">
                    <span class="team-name">{{ team.name }}</span>
                    <span
                      :class="[
                        'status-indicator',
                        team.is_active ? 'active' : 'inactive',
                      ]"
                    >
                      {{ team.is_active ? "Активна" : "Неактивна" }}
                    </span>
                  </div>
                </td>
                <td class="cell-creator">
                  <div class="creator-placeholder">
                    <i class="creator-icon">👤</i>
                    <span class="placeholder-text">Не указан</span>
                  </div>
                </td>
                <td class="cell-actions">
                  <div class="actions-group">
                    <button
                      @click="viewTeamPlayers(team)"
                      class="btn btn-outline players-btn"
                    >
                      <i class="btn-icon">👥</i>
                      <span class="btn-text">Игроки</span>
                    </button>
                    <button
                      @click="toggleTeamStatus(team)"
                      :class="[
                        'btn',
                        team.is_active ? 'btn-warning' : 'btn-success',
                        'status-btn',
                      ]"
                    >
                      <i
                        :class="[
                          'btn-icon',
                          team.is_active ? 'icon-pause' : 'icon-play',
                        ]"
                      >
                        {{ team.is_active ? "⏸️" : "▶️" }}
                      </i>
                      <span class="btn-text">
                        {{ team.is_active ? "Деактивировать" : "Активировать" }}
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="teams.length === 0 && !loading" class="empty-state">
            <div class="empty-icon">🏀</div>
            <div class="empty-message">Нет доступных команд</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import api from "../../services/api";

const teams = ref([]);
const loading = ref(false);

const loadTeams = async () => {
  loading.value = true;
  try {
    const response = await api.get("/team/admin/getAllTeams");
    teams.value = response.data.teams || response.data;
    console.log(teams.value);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadTeams();
});
</script>

<style scoped>
.teams-admin {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

/* Заголовок */
.page-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-header h2 .icon {
  font-size: 28px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.count-badge {
  background: #3b82f6;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

/* Состояние загрузки */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f1f5f9;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
}

/* Контейнер таблицы */
.teams-table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.table-wrapper {
  padding: 0;
}

/* Таблица */
.table-responsive {
  overflow-x: auto;
}

.teams-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

/* Заголовок таблицы */
.table-header {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.table-header th {
  padding: 18px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Строки таблицы */
.team-row {
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
}

.team-row:hover {
  background-color: #f8fafc;
}

.team-row.inactive-team {
  opacity: 0.7;
  background-color: #fef2f2;
}

.team-row.inactive-team:hover {
  background-color: #fee2e2;
}

/* Ячейки */
.teams-table td {
  padding: 20px;
  vertical-align: middle;
}

/* ID команды */
.cell-id {
  width: 80px;
}

.team-id {
  background: #f1f5f9;
  color: #475569;
  padding: 6px 12px;
  border-radius: 6px;
  font-family: "SF Mono", Monaco, monospace;
  font-size: 13px;
  font-weight: 500;
}

/* Название команды */
.cell-name {
  min-width: 250px;
}

.team-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.team-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.status-indicator {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  width: fit-content;
}

.status-indicator.active {
  background: #dcfce7;
  color: #166534;
}

.status-indicator.inactive {
  background: #fef2f2;
  color: #991b1b;
}

/* Создатель команды */
.cell-creator {
  min-width: 200px;
}

.creator-placeholder {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #94a3b8;
}

.creator-icon {
  font-size: 20px;
  opacity: 0.6;
}

.placeholder-text {
  font-size: 14px;
  font-style: italic;
}

/* Действия */
.cell-actions {
  min-width: 300px;
}

.actions-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Кнопки */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  white-space: nowrap;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 16px;
}

.btn-text {
  font-size: 14px;
}

/* Кнопка игроков */
.btn-outline {
  background: transparent;
  border-color: #e2e8f0;
  color: #475569;
}

.btn-outline:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/* Кнопка статуса */
.btn-success {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.btn-success:hover {
  background: #059669;
  border-color: #059669;
}

.btn-warning {
  background: #f59e0b;
  color: white;
  border-color: #f59e0b;
}

.btn-warning:hover {
  background: #d97706;
  border-color: #d97706;
}

/* Пустое состояние */
.empty-state {
  padding: 80px 24px;
  text-align: center;
  background: white;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.3;
}

.empty-message {
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
}

/* Адаптивность */
@media (max-width: 768px) {
  .teams-admin {
    padding: 16px;
  }

  .page-header {
    padding: 20px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .page-header h2 {
    font-size: 20px;
  }

  .team-row {
    position: relative;
  }

  .actions-group {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .teams-table td {
    padding: 16px 12px;
  }

  .teams-table th {
    padding: 14px 12px;
  }
}
</style>
