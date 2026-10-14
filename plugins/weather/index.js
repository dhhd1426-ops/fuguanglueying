// 天气：Open-Meteo 公开接口，不用 key。
var CODES = {
  0: '晴', 1: '大致晴朗', 2: '局部多云', 3: '阴', 45: '雾', 48: '雾凇',
  51: '小毛毛雨', 53: '毛毛雨', 55: '大毛毛雨', 56: '冻毛毛雨', 57: '冻毛毛雨',
  61: '小雨', 63: '中雨', 65: '大雨', 66: '冻雨', 67: '冻雨',
  71: '小雪', 73: '中雪', 75: '大雪', 77: '雪粒', 80: '阵雨', 81: '阵雨', 82: '强阵雨',
  85: '阵雪', 86: '强阵雪', 95: '雷阵雨', 96: '雷阵雨伴冰雹', 99: '雷阵雨伴冰雹'
};

function getJson(url) {
  var r = JSON.parse(host.fetch(url, '{}'));
  if (r.error) throw new Error(r.error);
  if (r.status !== 200) throw new Error('接口返回 ' + r.status);
  return JSON.parse(r.body);
}

function locate(city) {
  var cached = host.get('geo:' + city);
  if (cached) return JSON.parse(cached);
  var g = getJson('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(city) + '&count=1&language=zh');
  if (!g.results || !g.results.length) throw new Error('找不到这个城市：' + city);
  var p = g.results[0];
  var loc = { lat: p.latitude, lon: p.longitude, name: p.name, admin: p.admin1 || '', country: p.country || '' };
  host.set('geo:' + city, JSON.stringify(loc));
  return loc;
}

tools.get_weather = function (args) {
  var city = (args.city || '').trim();
  if (!city) return { error: '要先告诉我城市' };
  var days = Math.min(7, Math.max(1, parseInt(args.days, 10) || 3));
  var loc = locate(city);
  var f = getJson('https://api.open-meteo.com/v1/forecast?latitude=' + loc.lat + '&longitude=' + loc.lon +
    '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum' +
    '&timezone=auto&forecast_days=' + days);
  var c = f.current || {};
  var d = f.daily || {};
  var out = [];
  for (var i = 0; i < (d.time || []).length; i++) {
    out.push({
      date: d.time[i],
      weather: CODES[d.weather_code[i]] || ('天气代码 ' + d.weather_code[i]),
      high: d.temperature_2m_max[i],
      low: d.temperature_2m_min[i],
      rain_chance: d.precipitation_probability_max ? d.precipitation_probability_max[i] : null,
      rain_mm: d.precipitation_sum ? d.precipitation_sum[i] : null
    });
  }
  return {
    city: loc.name + (loc.admin && loc.admin !== loc.name ? '，' + loc.admin : '') + (loc.country ? '，' + loc.country : ''),
    now: {
      temp: c.temperature_2m, feels: c.apparent_temperature, humidity: c.relative_humidity_2m,
      weather: CODES[c.weather_code] || '', wind_kmh: c.wind_speed_10m, time: c.time
    },
    daily: out,
    unit: '摄氏度'
  };
};
