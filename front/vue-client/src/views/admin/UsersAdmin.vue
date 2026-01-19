<template>
  <div class="players">
    <h2>Управление пользователями</h2>
    <div class="table-players">
      <div class="row">
        <div>Id</div>
        <div>Name</div>
        <div>EMail</div>
        <div>Role</div>
        <div></div>
      </div>
      <div v-if="users">
        <div v-for="user in users" :key="user.id" class="row">
          <div>{{ user.id }}</div>
          <div>{{ user.name }}</div>
          <div>{{ user.email }}</div>
          <div>{{ user.role }}</div>
          <div>
            <button @click="deleteUser(user)">Удалить</button>
          </div>
        </div>
      </div>
      <div v-else>Нет пользователей</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import api from "../../services/api";
import { use } from "react";
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
<style>
.table-players {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.row {
  display: flex;
  gap: 10px;
}
</style>
