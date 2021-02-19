<template>
  <div class="quiz-selection">
    <select v-model="selected">
      <option disabled value="">Please select one</option>
      <option v-for="(level, idx) in levels" v-bind:key="idx"> 
        {{ levels[idx] }} 
      </option>
    </select>
    <button @click="levelSelected" :disabled="!selected">Go!</button>
  </div>
</template>

<script>
export default {
  name: "SelectLevel",
  data() {
    return {
      selected: null,
      levels: ['hsk1', 'hsk2', 'hsk3', 'hsk4', 'hsk5', 'hsk6']
    }
  },
  methods: {
    levelSelected(e) {
      e.preventDefault();
      const level = this.selected.replace('hsk', '');
      console.log(level); 
      this.$emit('level-selected', level);
    }
  }
}
</script>

<style scoped>
  .quiz-selection {
    padding: 10px; 
  }

  select {
    padding: 4px 6px; 
    width: 200px;
  }

  button {
    padding: 4px 6px;
    margin-left: 10px;
  }

</style>