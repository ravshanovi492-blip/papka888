
const form = document.getElementById("workerForm");
const workerList = document.getElementById("workerList");
const emptyMessage = document.getElementById("emptyMessage");

let workers = JSON.parse(localStorage.getItem("workers")) || [];
let editIndex = -1;
let selectedPhoto = "";

// Ma'lumotlarni saqlash
function saveWorkers() {
    try {
        localStorage.setItem("workers", JSON.stringify(workers));
        return true;
    } catch (error) {
        alert("Xotira to‘ldi! Rasm hajmini kichraytiring.");
        return false;
    }
}

// Jadvalni chiqarish
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

        // Rasm
        const photoCell = document.createElement("td");
        const img = document.createElement("img");

        img.src = worker.photo || "https://placehold.co/100x100";
        img.className = "worker-photo";
        photoCell.appendChild(img);

        // Tartib raqami
        const numberCell = document.createElement("td");
        numberCell.textContent = index + 1;
        row.appendChild(numberCell);

        // Rasmni chiqarish
        row.appendChild(photoCell);

        // Qolgan ma'lumotlar
        values.slice(1).forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
        });

        // Tahrirlash va o‘chirish
        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Tahrirlash";
        editButton.className = "edit-btn";

        editButton.onclick = () => {
            editWorker(index);
        };

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "O‘chirish";
        deleteButton.className = "delete-btn";

        deleteButton.onclick = () => {
            deleteWorker(index);
        };

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);

        workerList.appendChild(row);
    });
}

// Rasm tanlash
document.getElementById("photo").addEventListener("change", function() {
    const file = this.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Rasm faylini tanlang!");
        this.value = "";
        return;
    }

    if (file.size > 1024 * 1024) {
        alert("Rasm 1 MB dan kichik bo‘lishi kerak!");
        this.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        selectedPhoto = event.target.result;
    };

    reader.readAsDataURL(file);
});

// Ishchi qo‘shish
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const worker = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        age: document.getElementById("age").value,
        birth: document.getElementById("birth").value,
        district: document.getElementById("district").value.trim(),
        job: document.getElementById("job").value.trim(),
        photo: selectedPhoto
    };

    if (!worker.firstName || !worker.lastName ||
        !worker.age || !worker.birth ||
        !worker.district || !worker.job) {
        alert("Barcha maydonlarni to‘ldiring!");
        return;
    }

    if (editIndex >= 0) {
        worker.photo = selectedPhoto || workers[editIndex].photo || "";
        workers[editIndex] = worker;
    } else {
        workers.push(worker);
    }

    if (!saveWorkers()) return;

    showWorkers();
    form.reset();
    resetForm();

    alert("Ishchi ro‘yxatga qo‘shildi!");
});

// Tahrirlash
function editWorker(index) {
    const worker = workers[index];

    document.getElementById("firstName").value = worker.firstName;
    document.getElementById("lastName").value = worker.lastName;
    document.getElementById("age").value = worker.age;
    document.getElementById("birth").value = worker.birth;
    document.getElementById("district").value = worker.district;
    document.getElementById("job").value = worker.job;

    selectedPhoto = "";
    editIndex = index;

    document.getElementById("formTitle").textContent = "✏️ Ishchini tahrirlash";
    document.getElementById("submitBtn").textContent = "O‘zgarishlarni saqlash";
    document.getElementById("cancelBtn").hidden = false;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// O‘chirish
function deleteWorker(index) {
    if (confirm("Ishchini o‘chirmoqchimisiz?")) {
        workers.splice(index, 1);

        if (saveWorkers()) {
            resetForm();
            form.reset();
            showWorkers();
        }
    }
}

// Formani tozalash
function resetForm() {
    editIndex = -1;
    selectedPhoto = "";

    document.getElementById("formTitle").textContent =
        "➕ Yangi ishchi qo‘shish";

    document.getElementById("submitBtn").textContent =
        "+ Ishchini qo‘shish";

    document.getElementById("cancelBtn").hidden = true;
    document.getElementById("photo").value = "";
}

// Bekor qilish
document.getElementById("cancelBtn").onclick = function() {
    form.reset();
    resetForm();
};

// Sahifa ochilganda
showWorkers();
