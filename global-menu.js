document.addEventListener('DOMContentLoaded', () => {
  // Adjust canvas position and size, if any
  const canvas = document.querySelector('canvas');
  if (canvas) {
    canvas.style.position = 'absolute';
    canvas.style.top = '3em'; // same height as the global menu
    canvas.style.height = `calc(100% - 3em)`;
  }
  // Create the global menu bar
  const bar = document.createElement('div');
  bar.id = 'global-curated-menu';
  bar.innerHTML = `
    <button onclick="location.href='cloud_music_no_1.html'">cloud_music_no_1</button>
    <button onclick="location.href='cloud_music_no_9.html'">cloud_music_no_2</button>
    <button onclick="location.href='index.html'" style="margin-left:auto;">About cloud-5</button>
  `;
  document.body.prepend(bar); // insert at the very top of body
});
