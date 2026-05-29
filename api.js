const GAS_URL = "https://script.google.com/macros/s/AKfycbzmvCnlGFEDM6u4lLuWAJjxGebucapTzd1WY2SpJxC49rh5EhLRmAhIxtLxCQC-gghVNg/exec";
// ↑↑ 新しいGASURLに書き換え
async function apiFetch(params) {

  const query =
    new URLSearchParams(params);

  const res = await fetch(
    `${GAS_URL}?${query}`
  );

  return await res.json();
}

