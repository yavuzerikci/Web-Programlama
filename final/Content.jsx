import { useEffect, useMemo, useState } from "react";

const WMO = {
  0: "Açık",
  1: "Çoğunlukla açık",
  2: "Parçalı bulutlu",
  3: "Bulutlu",
  45: "Sisli",
  48: "Kırağı sis",
  51: "Hafif çise",
  53: "Çise",
  55: "Yoğun çise",
  61: "Hafif yağmur",
  63: "Yağmur",
  65: "Şiddetli yağmur",
  71: "Hafif kar",
  73: "Kar",
  75: "Yoğun kar",
  80: "Sağanak",
  81: "Kuvvetli sağanak",
  82: "Çok kuvvetli sağanak",
  95: "Gök gürültülü fırtına",
  96: "Fırtına + dolu",
  99: "Şiddetli fırtına + dolu",
};

function pickTheme({ temp, precip, code, cloud }) {
  // Öncelik: yağış/snow -> sonra güneş -> sonra bulut -> mild
  const snowyCodes = new Set([71, 73, 75, 77, 85, 86]);
  const rainyCodes = new Set([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99]);

  if (snowyCodes.has(code) || temp <= 1) return "snow";
  if (rainyCodes.has(code) || precip > 0) return "rain";
  if (temp >= 15 && cloud <= 55) return "sun";
  if (cloud >= 65 || code === 3) return "cloud";
  return "mild";
}

export default function Content({ onThemeChange }) {
  const [city, setCity] = useState("");
  const [query, setQuery] = useState(""); // arama tetikleyici
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [data, setData] = useState(null); // {name,country,temp,feels,humidity,wind,precip,cloud,code}

  const canSearch = useMemo(() => query.trim().length >= 2, [query]);

  useEffect(() => {
    if (!canSearch) return;

    const run = async () => {
      setLoading(true);
      setErr("");
      setData(null);

      try {
        // 1) şehir -> enlem boylam (Open-Meteo Geocoding)
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query.trim()
        )}&count=1&language=tr&format=json`;

        const geoRes = await fetch(geoUrl);
        if (!geoRes.ok) throw new Error("Şehir aramasında hata oldu.");
        const geoJson = await geoRes.json();

        if (!geoJson?.results?.length) {
          throw new Error("Şehir bulunamadı. Yazımı kontrol et.");
        }

        const g = geoJson.results[0];
        const lat = g.latitude;
        const lon = g.longitude;

        // 2) hava durumu (Open-Meteo Forecast - current)
        const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,cloud_cover&timezone=auto`;

        const wxRes = await fetch(wxUrl);
        if (!wxRes.ok) throw new Error("Hava durumu alınamadı.");
        const wxJson = await wxRes.json();

        const c = wxJson.current;
        const next = {
          name: g.name,
          country: g.country,
          temp: Math.round(c.temperature_2m),
          feels: Math.round(c.apparent_temperature),
          humidity: Math.round(c.relative_humidity_2m),
          wind: Math.round(c.wind_speed_10m),
          precip: Number(c.precipitation || 0),
          cloud: Math.round(c.cloud_cover ?? 0),
          code: Number(c.weather_code),
          time: c.time,
        };

        setData(next);

        const theme = pickTheme({
          temp: next.temp,
          precip: next.precip,
          code: next.code,
          cloud: next.cloud,
        });
        onThemeChange?.(theme);
      } catch (e) {
        setErr(e?.message || "Bir hata oluştu.");
        onThemeChange?.("mild");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [canSearch, query, onThemeChange]);

  const onSubmit = (e) => {
    e.preventDefault();
    const q = city.trim();
    if (q.length < 2) return;
    setQuery(q);
  };

  const conditionText = data ? (WMO[data.code] || "Bilinmiyor") : "";

  return (
    <main className="main">
      <section className="card">
        <form className="search" onSubmit={onSubmit}>
          <input
            className="input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Şehir adı (örn: Ankara, İzmir, Adana)"
            spellCheck={false}
          />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Aranıyor..." : "Getir"}
          </button>
        </form>

        {err && <div className="alert error">⚠️ {err}</div>}
        {loading && <div className="alert info">⏳ Yükleniyor...</div>}

        {data && !loading && !err && (
          <div className="weather">
            <div className="weatherTop">
              <div>
                <h2 className="place">
                  {data.name}
                  <span className="country"> / {data.country}</span>
                </h2>
                <div className="desc">{conditionText}</div>
              </div>

              <div className="tempBox">
                <div className="temp">{data.temp}°</div>
                <div className="feels">Hissedilen: {data.feels}°</div>
              </div>
            </div>

            <div className="grid">
              <div className="mini">
                <div className="miniLabel">Nem</div>
                <div className="miniValue">%{data.humidity}</div>
              </div>

              <div className="mini">
                <div className="miniLabel">Rüzgar</div>
                <div className="miniValue">{data.wind} km/s</div>
              </div>

              <div className="mini">
                <div className="miniLabel">Yağış</div>
                <div className="miniValue">{data.precip} mm</div>
              </div>

              <div className="mini">
                <div className="miniLabel">Bulut</div>
                <div className="miniValue">%{data.cloud}</div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
