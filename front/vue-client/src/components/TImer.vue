<template>
  <div>
    <p>до клнца соревнования осталось 7 д ч м с</p>
    <p>статистика обновляется каждые 2 дня</p>
  </div>
</template>

<script>
//admin/time1
import { ref, onMounted, computed } from "vue";
const COMP_DURATION = 7 * 24 * 60 * 60 * 1000;
const START_TIME_KEY = "start_time";
const startTime = ref(null);
const currentTime = ref(Date.now());

const initTimer = () => {
  const savedStartTime = localStorage.getItem(START_TIME_KEY);
  if (savedStartTime) {
    startTime.value = parseInt(savedStartTime);
  } else {
    startTime.value = Date.now();
    localStorage.setItem(START_TIME_KEY, startTime.value.toString());
  }
};

const timeL = computed(() => {
  if (!startTime.value) return COMP_DURATION;
  const r = currentTime.value - startTime.value;
});
</script>
