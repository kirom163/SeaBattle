function dropDifficulty() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  function dropPlacement() {
    document.getElementById("DropdownPlacement").classList.toggle("show");
  }
  function dropPlacementX() {
    document.getElementById("DropdownHelp").classList.toggle("show");
  }
  // Закрытие выпадающего списка по нажатию вне кнопки
  window.onclick = function(event) {
    if (!event.target.matches('.app-action')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }