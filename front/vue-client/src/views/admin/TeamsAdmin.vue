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
              <tr v-for="team in teams" :key="team.id" class="team-row">
                <td class="cell-id">
                  <span class="team-id">#{{ team.id }}</span>
                </td>
                <td class="cell-name">
                  <div class="team-info">
                    <span class="team-name">{{ team.name }}</span>
                  </div>
                </td>
                <td class="cell-creator">
                  <div class="creator-placeholder">
                    <i class="creator-icon">👤</i>
                    <span v-if="team.user" class="placeholder-text">
                      {{ team.user.name }}<br />
                      {{ team.user.email }}
                    </span>
                    <span v-else> Пользователь заблокирован!</span>
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
                    <button @click="deleteTeam(team)">Удалить</button>
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
let playersModalArray = ref([]);
const teams = ref([]);
const loading = ref(false);
let pleyersModal = ref(false);

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

const closeModal = () => {
  pleyersModal.value = false;
};

const viewTeamPlayers = (team) => {
  //console.log(team);
  pleyersModal.value = true;
  playersModalArray = team.players;
};

const deleteTeam = async (team) => {
  if (!confirm(`Вы уверены, что хотите удалить команду ${team.name}?`)) {
    return;
  }

  loading.value = true;
  try {
    const response = await api.delete(`/admin/teams/${team.id}`);
    loadTeams();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadTeams();
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

/* _______________________ */
/* Фон модального окна */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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
