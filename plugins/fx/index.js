// 汇率：open.er-api.com 公开接口，每天更新，不用 key。缓存 12 小时。
function rates(base) {
  var key = 'rates:' + base;
  var cached = host.get(key);
  if (cached) {
    var c = JSON.parse(cached);
    if (Date.now() - c.at < 12 * 3600 * 1000) return c.data;
  }
  var r = JSON.parse(host.fetch('https://open.er-api.com/v6/latest/' + base, '{}'));
  if (r.error) throw new Error(r.error);
  var data = JSON.parse(r.body);
  if (data.result !== 'success') throw new Error('不认识的货币：' + base);
  host.set(key, JSON.stringify({ at: Date.now(), data: data }));
  return data;
}

tools.convert = function (args) {
  var from = String(args.from || '').toUpperCase().trim();
  var to = String(args.to || '').toUpperCase().trim();
  var amount = Number(args.amount);
  if (!isFinite(amount) || amount <= 0) amount = 1;
  if (!from || !to) return { error: '要说清楚从哪种货币换到哪种' };
  var d = rates(from);
  var rate = d.rates[to];
  if (!rate) return { error: '不认识的货币：' + to };
  var v = amount * rate;
  return {
    amount: amount, from: from, to: to,
    rate: Math.round(rate * 10000) / 10000,
    result: Math.round(v * 100) / 100,
    updated: d.time_last_update_utc
  };
};
