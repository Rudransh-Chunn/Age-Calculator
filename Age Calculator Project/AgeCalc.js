const form = document.getElementById("form");

const dayEl = document.getElementById("day");
const monthEl = document.getElementById("month");
const yearEl = document.getElementById("year");

const outputs = {
  years: document.getElementById("years"),
  months: document.getElementById("months"),
  days: document.getElementById("days")
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const day = +dayEl.value;
  const month = +monthEl.value;
  const year = +yearEl.value;

  let valid = true;

  const setError = (el, msg) => {
    const f = el.parentElement;
    f.classList.add("error");
    f.querySelector("small").textContent = msg;
    valid = false;
  };

  const clearError = (el) => {
    const f = el.parentElement;
    f.classList.remove("error");
    f.querySelector("small").textContent = "";
  };

  [dayEl, monthEl, yearEl].forEach(clearError);

  if (!day) setError(dayEl, "Required");
  else if (day < 1 || day > 31) setError(dayEl, "Invalid day");

  if (!month) setError(monthEl, "Required");
  else if (month < 1 || month > 12) setError(monthEl, "Invalid month");

  if (!year) setError(yearEl, "Required");

  if (!valid) return;

  const birth = new Date(year, month - 1, day);

  if (
    birth.getDate() !== day ||
    birth.getMonth() !== month - 1 ||
    birth.getFullYear() !== year
  ) {
    setError(dayEl, "Invalid date");
    return;
  }

  const today = new Date();

  if (birth > today) {
    setError(yearEl, "Must be in past");
    return;
  }

  const age = getAge(birth, today);

  animate(outputs.years, age.y);
  animate(outputs.months, age.m);
  animate(outputs.days, age.d);
});

function getAge(birth, today) {
  let y = today.getFullYear() - birth.getFullYear();
  let m = today.getMonth() - birth.getMonth();
  let d = today.getDate() - birth.getDate();

  if (d < 0) {
    m--;
    d += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }

  if (m < 0) {
    y--;
    m += 12;
  }

  return { y, m, d };
}

function animate(el, target) {
  let current = 0;
  const duration = 1000;
  const startTime = performance.now();

  el.classList.add("blur");

  function update(time) {
    const progress = Math.min((time - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(ease * target);

    if (value !== current) {
      current = value;
      el.textContent = current;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
      el.classList.remove("blur");
      el.classList.add("pop");
      setTimeout(() => el.classList.remove("pop"), 200);
    }
  }

  requestAnimationFrame(update);
}

[dayEl, monthEl, yearEl].forEach(input => {
  input.addEventListener("input", () => {
    const f = input.parentElement;
    f.classList.remove("error");
    f.querySelector("small").textContent = "";
  });
});

const trail = document.createElement("div");
trail.className = "cursor-trail";
document.body.appendChild(trail);

window.addEventListener("mousemove", (e) => {
  trail.style.left = e.clientX + "px";
  trail.style.top = e.clientY + "px";
});

const btn = document.querySelector(".btn");

btn.addEventListener("mousemove", (e) => {
  const rect = btn.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  btn.style.setProperty("--x", x + "px");
  btn.style.setProperty("--y", y + "px");
});