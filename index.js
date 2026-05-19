/* =====================================
   支援員一覧取得
===================================== */

window.onload = async () => {

  const res = await fetch(
    `${GAS_URL}?type=staffList`
  );

  const staffs = await res.json();

  console.log(staffs);

  const select =
    document.getElementById("staff-select");

  staffs.forEach(staff => {

    const option =
      document.createElement("option");

    option.value = staff.name;

    option.textContent = staff.name;

    select.appendChild(option);

  });

};


async function login() {

 const name =
  document.getElementById("staff-select").value;

  if (!name) {

    document.getElementById("message")
      .textContent =
      "支援員を選択してください";

    return;
  }

  const res = await fetch(
    `${GAS_URL}?type=staff&name=${name}`
  );

  const data = await res.json();

  console.log(data);

  if (data.role === "admin") {

    sessionStorage.setItem(
      "adminLogin",
      "true"
    );

    sessionStorage.setItem(
      "adminName",
      data.name
    );

    location.href =
      "dashboard.html";

  } else {

    document.getElementById("message")
      .textContent =
      "ログイン失敗";

  }
}
