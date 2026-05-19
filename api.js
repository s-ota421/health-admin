const GAS_URL = "https://script.google.com/macros/s/AKfycbxqqvWP2MzB-Yn-BruS08BrGh_TsI2YBy7yRcVptcWtSKlJapD1eGDv99DPruUVcEh--g/exec";
// ↑↑ 新しいGASURLに書き換え
async function apiFetch(params) {

  const query =
    new URLSearchParams(params);

  const res = await fetch(
    `${GAS_URL}?${query}`
  );

  return await res.json();
}

