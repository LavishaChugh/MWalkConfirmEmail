document.getElementById('search-input').addEventListener('focus', function() {
	document.getElementById('dropdown-menu').style.display = 'block';
});

document.addEventListener('click', function(event) {
	const dropdownMenu = document.getElementById('dropdown-menu');
	const isClickInside = dropdownMenu.contains(event.target) || document.getElementById('search-input').contains(event.target);
	
	if (!isClickInside) {
		dropdownMenu.style.display = 'none';
	}
});

document.querySelectorAll('#dropdown-menu a').forEach(function(link) {
	link.addEventListener('click', function() {
		document.getElementById('dropdown-menu').style.display = 'none';
	});
});

