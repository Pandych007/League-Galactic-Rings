<template>
  <div class="players-admin">
    <div class="page-header">
      <h2>Управление игроками</h2>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import api from "@/services/api";

const players = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = ref(20);

const searchQuery = ref("");
const statusFilter = ref("");
const positionFilter = ref("");

const showAddPlayerForm = ref(false);
const editingPlayer = ref(false);
const saveingPlayer = ref(false);

const playerForm = ref({
  name: "",
  postion: "",
  points: 0,
  cost: 0,
  is_active: true,
});

const errors = ref({});

const totalPlayers = computed(() => players.value.length);

const activePLayers = computed(() => {
  return players.value.filter((player) => player.is_active).length;
});


const loadPlayers = async () => {
    loading.value = true
    try{
        const params = {
            page: currentPage.value,
            limit: itemsPerPage.value,
            search: searchQuery.value,
            position: positionFilter.value,
            status: statusFilter.value
        }

        Object.keys(params).forEach(key => {
            if(!params[key]) delete params[key]
        })


    }
}
</script>
