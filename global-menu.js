function injectGlobalMenuList() {
    // Ensure the main menu container exists
    const mainMenu = document.getElementById('main_menu');
    const mainMenuList = document.getElementById('main_menu_list');

    if (!mainMenu || !mainMenuList) {
        console.warn("main_menu or main_menu_list not found.");
        return;
    }

    // Check if the global_menu_list is already present
    if (document.getElementById('global_menu_list')) {
        console.warn("global_menu_list already exists.");
        return;
    }

    // Create the global_menu_list element
    const globalMenuList = document.createElement('ul');
    globalMenuList.className = 'menu cloud5-main-menu';
    globalMenuList.id = 'global_menu_list';

    // Add the menu items
    globalMenuList.innerHTML = `
        <li class="w3-btn w3-pink w3-hover-text-amber" onclick="location.href='cloud-music.html'">About cloud-music</li>
        <li class="w3-btn w3-text-orange w3-hover-text-amber" onclick="location.href='cloud_music_no_1.html'">Cloud Music No. 1</li>
        <li class="w3-btn w3-text-orange w3-hover-text-amber" onclick="location.href='cloud_music_no_2.html'">Cloud Music No. 2</li>
        <li class="w3-btn w3-text-orange w3-hover-text-amber" onclick="location.href='cloud_music_no_9.html'">Cloud Music No. 9</li>
        <li class="w3-btn w3-text-orange w3-hover-text-amber" onclick="location.href='cloud_music_no_13.html'">Cloud Music No. 13</li>
        <li class="w3-btn w3-text-orange w3-hover-text-amber" onclick="location.href='cloud_music_no_14.html'">Cloud Music No. 14</li>
        <li class="w3-btn w3-text-orange w3-hover-text-amber" onclick="location.href='cancycle.html'">Cancycle</li>
        <li class="w3-btn w3-text-orange w3-hover-text-amber" onclick="location.href='polymetric.html'">Polymetric</li>
        <li class="w3-btn w3-text-orange w3-hover-text-amber" onclick="location.href='scrims.html'">Scrims</li>
        <li class="w3-btn w3-text-orange w3-hover-text-amber" onclick="location.href='trichord_space.cloud5.html'">Trichord Space</li>
    `;

    // Insert globalMenuList before mainMenuList
    mainMenu.insertBefore(globalMenuList, mainMenuList);
}

injectGlobalMenuList();
