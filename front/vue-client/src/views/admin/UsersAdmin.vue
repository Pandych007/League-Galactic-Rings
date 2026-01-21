<template>
  <div class="users-management-container">
    <div class="management-header">
      <h2 class="management-title">
        <svg
          class="title-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M20 21C20 18.7909 18.2091 17 16 17H8C5.79086 17 4 18.7909 4 21"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
        Управление пользователями
      </h2>
      <div class="stats">
        <span class="user-count" v-if="users">
          <span class="count-number">{{ users.length }}</span> пользователей
        </span>
        <div class="loader" v-if="loading">
          <div class="loader-spinner"></div>
          <span>Загрузка...</span>
        </div>
      </div>
    </div>

    <div class="table-container">
      <div class="table-header">
        <div class="header-cell cell-id">ID</div>
        <div class="header-cell cell-name">Имя</div>
        <div class="header-cell cell-email">Email</div>
        <div class="header-cell cell-role">Роль</div>
        <div class="header-cell cell-actions">Действия</div>
      </div>

      <div v-if="users && users.length" class="table-body">
        <div
          v-for="(user, index) in users"
          :key="user.id"
          class="table-row"
          :class="{
            'row-even': index % 2 === 0,
            'row-odd': index % 2 !== 0,
            'row-admin': user.role === 'admin',
          }"
        >
          <div class="cell cell-id">
            <span class="id-badge">#{{ user.id }}</span>
          </div>
          <div class="cell cell-name">
            <div class="user-info">
              <div class="avatar-placeholder">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <span class="user-name">{{ user.name }}</span>
            </div>
          </div>
          <div class="cell cell-email">
            <div class="email-wrapper">
              <svg
                class="email-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M22 6L12 13L2 6"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
              </svg>
              <span class="email-text">{{ user.email }}</span>
            </div>
          </div>
          <div class="cell cell-role">
            <span class="role-tag" :class="user.role">
              {{ user.role }}
            </span>
          </div>
          <div class="cell cell-actions">
            <button
              @click="deleteUser(user)"
              class="delete-button"
              :disabled="loading"
            >
              <svg
                class="delete-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <span class="delete-text">Удалить</span>
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="users && !users.length" class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
              stroke="#667eea"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
              stroke="#667eea"
              stroke-width="1.5"
            />
          </svg>
        </div>
        <h3 class="empty-title">Нет пользователей</h3>
        <p class="empty-description">
          Зарегистрированные пользователи появятся здесь
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import api from "../../services/api";
const users = ref([]);
const loading = ref(false);

const loadUsers = async () => {
  loading.value = true;
  try {
    const response = await api.get("/admin/getAllUsers");
    users.value = response.data.users || response.data;
    console.log(users.value);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (user) => {
  if (!confirm(`Вы уверены, что хотите удалить пользователя ${user.name}?`)) {
    return;
  }

  loading.value = true;
  try {
    const response = await api.delete(`/admin/deleteUser/${user.id}`);
    loadUsers();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.users-management-container {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  min-height: 500px;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 25px;
  border-bottom: 1px solid #eef2f7;
}

.management-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-icon {
  color: #667eea;
}

.stats {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-count {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.count-number {
  background: white;
  color: #667eea;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
}

.loader {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #718096;
  font-size: 14px;
}

.loader-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.table-container {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.table-header {
  display: grid;
  grid-template-columns: 100px minmax(150px, 1fr) minmax(200px, 1fr) 120px 140px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-cell {
  padding: 20px;
  display: flex;
  align-items: center;
}

.table-body {
  background: white;
}

.table-row {
  display: grid;
  grid-template-columns: 100px minmax(150px, 1fr) minmax(200px, 1fr) 120px 140px;
  align-items: center;
  padding: 18px 20px;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f7fafc;
}

.row-even {
  background: #ffffff;
}

.row-odd {
  background: #f8fafc;
}

.row-admin {
  border-left: 4px solid #667eea;
  background: linear-gradient(
    90deg,
    rgba(102, 126, 234, 0.05) 0%,
    rgba(102, 126, 234, 0) 100%
  );
}

.table-row:hover {
  background: #edf2f7;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.cell {
  padding: 0 20px;
  display: flex;
  align-items: center;
}

.cell-id .id-badge {
  font-family: "SF Mono", monospace;
  font-size: 12px;
  color: #4a5568;
  background: #e2e8f0;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}

.user-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 15px;
}

.email-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4a5568;
}

.email-icon {
  color: #a0aec0;
  flex-shrink: 0;
}

.email-text {
  font-size: 14px;
  word-break: break-all;
}

.role-tag {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 80px;
  text-align: center;
}

.role-tag.admin {
  background: linear-gradient(135deg, #f56565 0%, #ed8936 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(237, 137, 54, 0.2);
}

.role-tag:not(.admin) {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(72, 187, 120, 0.2);
}

.delete-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  justify-content: center;
}

.delete-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 101, 101, 0.3);
}

.delete-button:active:not(:disabled) {
  transform: translateY(0);
}

.delete-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.delete-icon {
  flex-shrink: 0;
}

.empty-state {
  padding: 80px 20px;
  text-align: center;
  background: white;
}

.empty-icon {
  margin-bottom: 20px;
  opacity: 0.8;
}

.empty-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 10px;
}

.empty-description {
  font-size: 14px;
  color: #718096;
  max-width: 300px;
  margin: 0 auto;
  line-height: 1.6;
}

@media (max-width: 1200px) {
  .table-header,
  .table-row {
    grid-template-columns:
      80px minmax(120px, 1fr) minmax(150px, 1fr)
      100px 120px;
  }
}

@media (max-width: 768px) {
  .users-management-container {
    padding: 20px;
  }

  .management-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .stats {
    width: 100%;
    justify-content: space-between;
  }

  .table-header,
  .table-row {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
    padding: 20px;
  }

  .header-cell,
  .cell {
    width: 100%;
    padding: 0;
    justify-content: space-between;
  }

  .delete-button {
    width: 100%;
  }

  .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
