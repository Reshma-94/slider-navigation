const navList = document.querySelector('.nav-list');
const slider = document.querySelector('.slider');
const cityName = document.querySelector('#city-name');
const cityTime = document.querySelector('#city-time');

const timeZones = {
    "Cupertino": "America/Los_Angeles",
    "New York City": "America/New_York",
    "London": "Europe/London",
    "Amsterdam": "Europe/Amsterdam",
    "Tokyo": "Asia/Tokyo",
    "Hong Kong": "Asia/Hong_Kong",
    "Sydney": "Australia/Sydney"
}

function updateSlider(activeItem){
    const { offsetLeft, offsetWidth } = activeItem;
    slider.style.left = `${offsetLeft}px`;
    slider.style.width = `${offsetWidth}px`;
}

function updateCityTime(city){
    const timeZone = timeZones[city];
    if(timeZone){
        const time = new Date().toLocaleTimeString('en-US', {timeZone, hour:'2-digit', minute:'2-digit', second:'2-digit'})
        cityName.textContent = city;
        cityTime.textContent = time;
    }
}

setInterval(() => {
    const activeCity = navList.querySelector('li.active');
    if(activeCity){
        updateCityTime(activeCity.textContent);
    }
}, 1000);

fetch('navigation.json')
.then((response) => response.json())
.then(data => {
    data.cities.forEach((city) => {
        const li = document.createElement('li');
        li.textContent = city.label;
        li.dataset.section = city.section;
        li.setAttribute("role", "menuitem");
        li.setAttribute("tabIndex", 0);
        li.setAttribute("aria-label", `Select ${city.label}`)
        navList.appendChild(li);
    })

    let activeCity = navList.querySelector('li');
    activeCity.classList.add('active');
    activeCity.setAttribute('aria-current', 'true');
    updateSlider(activeCity);
    updateCityTime(activeCity.textContent);

    navList.addEventListener('click', (e) => {
        if(e.target.tagName === 'LI'){
            navList.querySelectorAll('li').forEach(li => {
                li.classList.remove('active');
                li.removeAttribute('aria-current');
        });
            e.target.classList.add('active');
            e.target.setAttribute('aria-current', 'true')
            updateSlider(e.target)
        }
    });

}).catch(error => console.error('Error Loading JSON:', error));

window.addEventListener('resize', () => {
    const activeCity = navList.querySelector('li.active');
    if(activeCity){
        updateSlider(activeCity.textContent);
    }
})

