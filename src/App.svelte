<script>
  import { answers } from "./answers.js";
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";

  const ONEDAY = 24 * 60 * 60 * 1000;
  const OFFSET = 387; // answers.findIndex(w => w === "madam");

  const offsetDate = new Date(2022, 7 - 1, 11);
  const today = new Date();
  const daysFromOffset = Math.floor((today - offsetDate) / ONEDAY);
  const todaysWord = answers[OFFSET + daysFromOffset];
  const otherWords = answers.slice(OFFSET + daysFromOffset - 10, OFFSET + daysFromOffset).reverse();

  let freq;
  let otherFreqs = [];
  let showPrevious = false;
  onMount(async () => {
    setTimeout(async () => {
      let response = await fetch(`https://api.datamuse.com/words?sp=${todaysWord}&md=f&max=1`).then((res) => res.json());
      freq = +response[0].tags[0].slice(2);
    }, 500);

    setTimeout(async () => {
      for (let i = 0; i < otherWords.length; i++) {
        let w = otherWords[i];
        let response = await fetch(`https://api.datamuse.com/words?sp=${w}&md=f&max=1`).then((res) => res.json());
        otherFreqs[i] = +response[0].tags[0].slice(2);
      }
    }, 3000);
    setTimeout(() => (showPrevious = true), 2500);
  });
</script>

<div class="p-5 sd:p-10 pt-48 h-screen flex flex-col overflow-auto items-center bg-gradient-to-r from-violet-500 to-fuchsia-500">
  {#if freq}
    <h1 in:fade={{ duration: 300 }}>
      Todays wordle appears <span class:visible={showPrevious} in:fade={{ duration: 700 }} class="text-[cyan]">{freq.toFixed(2)}</span> times in a million
      words.
      <br />
      {#if showPrevious}
        <span in:fade={{ duration: 500 }}>Previous:</span>
      {/if}
    </h1>
  {/if}
  {#each otherFreqs as freq, i}
    <h2 in:fly={{ y: 200, duration: 500 }}>{otherWords[i]}: {freq.toFixed(2)}</h2>
  {/each}
</div>

<style global lang="postcss">
  @tailwind base;
  @tailwind utilities;

  body {
    @apply font-sans;
    margin: 0;
    padding: 0;
    color: whitesmoke;
  }

  h1 {
    display: block;
    font-weight: bold;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
  }

  h2 {
    display: block;
    font-weight: bold;
    font-size: 1.5em;
    /* margin-block-start: 0.83em; */
    /* margin-block-end: 0.83em; */
  }
</style>
