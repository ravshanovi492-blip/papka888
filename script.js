
const form = document.getElementById("workerForm");
const workerList = document.getElementById("workerList");
const emptyMessage = document.getElementById("emptyMessage");

// Saqlangan ishchilarni yuklash
let workers = JSON.parse(localStorage.getItem("workers")) || [];

// Ma'lumotlarni saqlash
function saveWorkers() {
    localStorage.setItem("workers", JSON.stringify(workers));
}

// Ishchilarni jadvalga chiqarish
function showWorkers() {
    workerList.innerHTML = "";

    emptyMessage.style.display =
        workers.length === 0 ? "block" : "none";

    workers.forEach((worker, index) => {
        const row = document.createElement("tr");

        const values = [
            index + 1,
            worker.firstName,
            worker.lastName,
            worker.age,
            worker.birth,
            worker.district,
            worker.job
        ];

        values.forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
        });

        const action = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "O‘chirish";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", () => {
            workers.splice(index, 1);
            saveWorkers();
            showWorkers();
        });

        action.appendChild(deleteButton);
        row.appendChild(action);

        workerList.appendChild(row);
    });
}

// Yangi ishchi qo‘shish
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const worker = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        age: document.getElementById("age").value,
        birth: document.getElementById("birth").value,
        district: document.getElementById("district").value.trim(),
        job: document.getElementById("job").value.trim()
    };

    workers.push(worker);

    saveWorkers();
    showWorkers();

    form.reset();

    alert("Ishchi muvaffaqiyatli qo‘shildi!");
});

// Sahifa ochilganda ro‘yxatni chiqarish
showWorkers();
