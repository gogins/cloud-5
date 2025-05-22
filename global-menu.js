document.addEventListener('DOMContentLoaded', () => {
   // Fill in the global menu bar.
  const bar = document.querySelector('#global-curated-menu');
  bar.innerHTML = `
    <button onclick="location.href='cloud_music_no_9.html'">cloud_music_no_2</button>
    <button onclick="location.href='index.html'" style="margin-left:auto;">All pieces</button>
    <button onclick="location.href='index.html'" style="margin-left:auto;">About cloud-5</button>
  `;
  document.body.prepend(bar); // insert at the very top of body
});
