<template>
  <div class="maker">
    <button
      v-if="curStepIndex - 1 >= 0"
      class="btn back"
      @click.prevent="curStepIndex = curStepIndex - 1;"
    >
      &larr; BACK
    </button>
    <button
      v-if="curStepIndex + 1 < steps.length"
      class="btn next"
      @click.prevent="curStepIndex = curStepIndex + 1;"
      :disabled="
        !feelings.length || (curStepIndex === 1 && !embodiments.length)
      "
    >
      NEXT &rarr;
    </button>
    <button
      v-if="curStepIndex + 1 === steps.length"
      class="btn finish"
      @click.prevent="curStepIndex = curStepIndex + 1;"
      :disabled="curStepIndex === 2 && !characteristics.length"
    >
      FINISH
    </button>

    <!-- Step 1 -->
    <div v-if="curStepIndex < steps.length">
      <h2>{{ curStep }}</h2>
      <small class="step"
        >step {{ curStepIndex + 1 }} / {{ steps.length }}</small
      >
      <div v-if="curStepIndex === 0">
        <p>List 2-5 <i>feelings</i> you want your brand to invoke.</p>
        <input
          type="text"
          aria-label="Add a feeling"
          v-bind:placeholder="feelings.length ? '' : 'eg. Relieved'"
          ref="feelings"
          v-model="feelingInput"
          @keypress="addFeelings"
        />
        <small>hit "Enter" to add your feeling</small>
        <div
          v-for="(feeling, index) in feelings"
          :key="index"
          class="list-item"
        >
          <b>{{ feeling.val }}</b>
          <button
            class="btn remove"
            :aria-label="'Remove ' + feeling.val"
            @click="removeFeeling(index);"
          >
            <b>&times;</b>
          </button>
        </div>
      </div>

      <!-- Step 2 -->
      <div v-if="curStepIndex === 1">
        <p>
          List persons, places, things, and/or phrases that <i>embody</i> for
          each of your feelings.
        </p>
        <button
          class="btn link"
          :class="{ active: activeFeeling == feeling }"
          :aria-pressed="String(activeFeeling == feeling)"
          v-for="(feeling, index) in feelingsReversed"
          :key="`tab-${index}`"
          @click.prevent="
            activeFeeling = feelings[feelings.length - 1 - index];
          "
        >
          {{ feeling.val }}
        </button>
        <div style="padding-top:15px;" v-if="activeFeeling">
          <input
            type="text"
            :aria-label="'Add an embodiment of ' + activeFeeling.val"
            v-model="embodimentInput"
            ref="embodimentInput"
            @keypress="addEmbodiment"
          />
          <small>hit "Enter" to add your embodiment</small>
        </div>
        <template v-for="(embodiment, index) in embodiments">
          <div
            v-if="embodiment.feeling.val == activeFeeling.val"
            :key="index"
            class="list-item"
          >
            <b>{{ embodiment.val }}</b>
            <button
              class="btn remove"
              :aria-label="'Remove ' + embodiment.val"
              @click="removeEmbodiment(index);"
            >
              <b>&times;</b>
            </button>
          </div>
        </template>
      </div>

      <!-- Step 3 -->
      <div v-if="curStepIndex === 2">
        <p>Finally, identify a specific characteristic of each embodiment.</p>
        <button
          class="btn link"
          :class="{ active: activeEmbodiment == embodiment }"
          :aria-pressed="String(activeEmbodiment == embodiment)"
          v-for="(embodiment, index) in embodimentsReversed"
          :key="`tab-${index}`"
          @click.prevent="
            activeEmbodiment = embodiments[embodiments.length - 1 - index];
          "
        >
          {{ embodiment.val }}
        </button>
        <div style="padding-top:15px;" v-if="activeEmbodiment">
          <input
            type="text"
            :aria-label="'Add a characteristic of ' + activeEmbodiment.val"
            v-model="characteristicInput"
            ref="characteristicInput"
            @keypress="addCharacteristic"
          />
          <small>hit "Enter" to add your characteristic</small>
        </div>
        <template v-for="(characteristic, index) in characteristics">
          <div
            v-if="characteristic.embodiment.val == activeEmbodiment.val"
            :key="index"
            class="list-item"
          >
            <b>{{ characteristic.val }}</b>
            <button
              class="btn remove"
              :aria-label="'Remove ' + characteristic.val"
              @click="removeCharacteristic(index);"
            >
              <b>&times;</b>
            </button>
          </div>
        </template>
      </div>
    </div>
    <div v-else class="results">
      <h2>Results</h2>
      <a href="#" style="color: salmon" @click.prevent="reset"
        >Clear & Start Over</a
      >
      <div class="characteristics">
        <div
          v-for="(characteristic, index) in characteristics"
          :key="index"
        >
          {{ characteristic.val }}
        </div>
      </div>
    </div>
    <div v-if="projectCount" class="projects">
      <h5>Load Previous Project:</h5>
      <button
        class="btn link"
        v-for="n in projectCount"
        :key="n"
        :aria-label="'Load project ' + n"
        @click.prevent="loadProject(n);"
      >
        {{ n }}
      </button>
    </div>
  </div>
</template>

<script>
// Saved work comes back through JSON.parse. A value that isn't JSON, or isn't
// the type the app saved (a stored "null", say), gives the fallback instead,
// so one bad value can't stop the page from mounting.
function safeLoad(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(fallback) ? Array.isArray(value) : typeof value === typeof fallback) {
      return value;
    }
  } catch {
    // not JSON: use the fallback
  }
  return fallback;
}

export default {
  name: "BrandNameMaker",
  data() {
    return {
      steps: ["Feelings", "Embodiment", "Characteristic"],
      curStepIndex: 0,
      feelings: safeLoad("feelings", []),
      embodiments: safeLoad("embodiments", []),
      characteristics: safeLoad("characteristics", []),
      projectCount: safeLoad("projectCount", 0),
      feelingInput: "",
      embodimentInput: "",
      characteristicInput: "",
      activeFeeling: "",
      activeEmbodiment: "",
      dirty: localStorage.getItem("dirty") === "true",
    };
  },
  computed: {
    curStep() {
      return this.steps[this.curStepIndex];
    },
    feelingsReversed() {
      return this.feelings.slice().reverse();
    },
    embodimentsReversed() {
      return this.embodiments.slice().reverse();
    },
  },
  methods: {
    addFeelings(e) {
      if (e.charCode === 13 && e.target.value.trim()) {
        let feeling = e.target.value;
        this.feelings.unshift({ val: feeling });
        this.feelingInput = "";
        this.dirty = true;
      }
    },
    removeFeeling(index) {
      this.feelings.splice(index, 1);
      this.dirty = true;
    },
    addEmbodiment(e) {
      if (e.charCode === 13 && e.target.value.trim()) {
        let embodiment = e.target.value;
        this.embodiments.unshift({
          val: embodiment,
          feeling: this.activeFeeling,
        });
        this.embodimentInput = "";
        this.dirty = true;
      }
    },
    removeEmbodiment(index) {
      this.embodiments.splice(index, 1);
      this.dirty = true;
    },
    addCharacteristic(e) {
      if (e.charCode === 13 && e.target.value.trim()) {
        let characteristic = e.target.value;
        this.characteristics.unshift({
          val: characteristic,
          embodiment: this.activeEmbodiment,
        });
        this.characteristicInput = "";
        this.dirty = true;
      }
    },
    removeCharacteristic(index) {
      this.characteristics.splice(index, 1);
      this.dirty = true;
    },
    // Unsaved work goes to a new project slot before anything replaces it.
    saveIfDirty() {
      if (!this.dirty) return;
      let count = this.projectCount + 1;
      localStorage.setItem(
        `feelings-${count}`,
        JSON.stringify(this.feelings)
      );
      localStorage.setItem(
        `embodiments-${count}`,
        JSON.stringify(this.embodiments)
      );
      localStorage.setItem(
        `characteristics-${count}`,
        JSON.stringify(this.characteristics)
      );
      this.projectCount = count;
    },
    reset() {
      this.saveIfDirty();
      this.feelings = [];
      this.embodiments = [];
      this.characteristics = [];
      this.curStepIndex = 0;
      this.dirty = false;
    },
    loadProject(count) {
      this.saveIfDirty();
      this.feelings = safeLoad(`feelings-${count}`, []);
      this.embodiments = safeLoad(`embodiments-${count}`, []);
      this.characteristics = safeLoad(`characteristics-${count}`, []);
      this.curStepIndex = 0;
      this.dirty = false;
    },
  },
  watch: {
    feelings() {
      localStorage.setItem("feelings", JSON.stringify(this.feelings));
    },
    embodiments() {
      localStorage.setItem("embodiments", JSON.stringify(this.embodiments));
    },
    characteristics() {
      localStorage.setItem(
        "characteristics",
        JSON.stringify(this.characteristics)
      );
    },
    projectCount() {
      localStorage.setItem("projectCount", JSON.stringify(this.projectCount));
    },
    dirty() {
      localStorage.setItem("dirty", JSON.stringify(this.dirty));
    },
    activeFeeling() {
      setTimeout(() => {
        this.$refs.embodimentInput.focus();
      }, 0);
    },
    activeEmbodiment() {
      setTimeout(() => {
        this.$refs.characteristicInput.focus();
      }, 0);
    },
    curStepIndex() {
      if (this.curStepIndex === 1) {
        this.activeFeeling = this.feelings[this.feelings.length - 1];
      } else if (this.curStepIndex === 2) {
        this.activeEmbodiment = this.embodiments[this.embodiments.length - 1];
      }
    },
  },
};
</script>

<style lang="scss">
.maker {
  padding-top: 20px;
  max-width: 30em;
  margin: 0 auto;
  h2 {
    width: 50%;
    margin: 0 auto;
  }
  h3 {
    margin-bottom: 5px;
  }
  .step {
    display: block;
    text-transform: uppercase;
  }
}
input[type="text"] {
  display: block;
  padding: 10px 15px;
  text-align: center;
  margin: 0 auto 5px;
  width: 250px;
  max-width: 100%;
  font-size: 16px;
}
.list-item {
  button {
    margin-right: -47px;
  }
}
.btn {
  outline: none;
  border: none;
  padding: 10px 20px;
  background: skyblue;
  border-radius: 3px;
  margin: 0;
  &:hover {
    cursor: pointer;
  }
  // Keyboard focus only: a mouse click still shows no outline.
  &:focus-visible {
    outline: 2px solid #2c3e50;
    outline-offset: 2px;
  }
  &.back {
    float: left;
  }
  &.next,
  &.finish {
    float: right;
  }
  &.remove {
    background: transparent;
    color: salmon;
  }
  &.link {
    display: inline-block;
    font-size: 16px;
    background-color: transparent;
    color: darken(skyblue, 10%);
    border-radius: 0;
    padding: 0;
    border-bottom: 1px solid;
    &:hover {
      color: skyblue;
    }
    + .link {
      margin-left: 15px;
    }
    &.active {
      color: black;
      border-bottom-color: transparent;
    }
  }
}
.results .characteristics {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
  div {
    box-sizing: border-box;
    padding: 10px 15px;
    min-width: 33%;
    font-size: 16px;
    white-space: nowrap;
  }
}
.projects {
  padding: 50px 0;
}
</style>
