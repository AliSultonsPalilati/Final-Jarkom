async function getWeather() {
    const city = document.getElementById('city').value;
    const apiKey = '786d24c2d775128404a6e1a41d7db82c'; // Ganti dengan API key Anda
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=id`;

    try {
        const response = await fetch(url);
        console.log(response);
        if (!response.ok) {
            throw new Error('Gagal mengambil data cuaca pada kota yang anda input');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.getElementById('weatherInfo').innerText = error.message;
    }
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weatherInfo');

    // Get weather for the next 7 days
    const forecasts = data.list;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    // Find forecasts closest to midday for each unique day
    const uniqueDays = {};
    forecasts.forEach(forecast => {
        const date = new Date(forecast.dt_txt);
        const day = date.toLocaleDateString('id-ID', options);

        // Choose the forecast closest to 12:00 PM if not available
        if (!uniqueDays[day] || Math.abs(date.getHours() - 12) < Math.abs(new Date(uniqueDays[day].dt_txt).getHours() - 12)) {
            uniqueDays[day] = forecast;
        }
    });

    // Display weather for each day
    let dayCount = 0;
    for (const day in uniqueDays) {
        if (dayCount >= 7) break;
        const forecast = uniqueDays[day];
        weatherInfo.innerHTML += `
            <div class="weather-box">
                <h3>${day}:</h3>
                <p>Suhu: ${forecast.main.temp}°C</p>
                <p>Cuaca: ${forecast.weather[0].description}</p>
                <p>Kecepatan Angin: ${forecast.wind.speed} m/s</p>
            </div>
        `;
        dayCount++;
    }
}