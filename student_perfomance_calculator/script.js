// ---- Settings: the allowed range for every mark ----
const MIN_MARK = 0;
const MAX_MARK = 100;
const students = []; // each: { name, marks: [n, n, n] }

document.getElementById("rangeText").textContent = MIN_MARK + " to " + MAX_MARK;

// ---- Validation: returns an error message, or "" if the mark is valid ----
function checkMark(raw, label) {
    const text = raw.trim();
    // Must check empty first: Number("") is 0, which would look like a valid mark.
    if (text === "") return label + " is missing.";
    const value = Number(text);
    if (Number.isNaN(value)) return label + " must be a number.";
    if (value < MIN_MARK || value > MAX_MARK) {
        return label + " must be between " + MIN_MARK + " and " + MAX_MARK + ".";
    }
    return "";
}

// ---- Calculation: average of an array; null if the array is empty ----
function average(marks) {
    if (marks.length === 0) return null; // avoids dividing by zero (NaN)
    const sum = marks.reduce((total, m) => total + m, 0);
    return sum / marks.length;
}

// ---- Add a student after validating everything ----
function addStudent() {
    const name = document.getElementById("name").value.trim();
    const labels = ["Math", "Science", "English"];
    const inputs = document.querySelectorAll(".mark");
    const errors = [];

    if (name === "") errors.push("Student name is missing.");
    inputs.forEach((input, i) => {
        const err = checkMark(input.value, labels[i]);
        if (err) errors.push(err);
    });

    showErrors(errors);
    if (errors.length > 0) return; // invalid input is never saved

    students.push({ name: name, marks: Array.from(inputs, i => Number(i.value.trim())) });
    document.getElementById("name").value = "";
    inputs.forEach(i => (i.value = ""));
    render();
}

function showErrors(errors) {
    const list = document.getElementById("errors");
    list.innerHTML = "";
    errors.forEach(msg => {
        const li = document.createElement("li");
        li.textContent = msg;
        list.appendChild(li);
    });
}

// ---- Display ----
function render() {
    const box = document.getElementById("results");
    box.innerHTML = "";

    // Clear message for an empty list
    if (students.length === 0) {
        box.innerHTML = '<p class="text-slate-600 dark:text-slate-400">No students yet. Add a student above to see their average.</p>';
        return;
    }

    const table = document.createElement("div");
    table.className = "overflow-x-auto";
    let rows = "";
    students.forEach(s => {
        const avg = average(s.marks);
        rows += "<tr class='border-t border-slate-200 dark:border-slate-700'>" +
            "<td class='py-2 pr-4'></td>" +
            "<td class='py-2 pr-4'>" + s.marks.join(", ") + "</td>" +
            "<td class='py-2 font-semibold'>" + avg.toFixed(2) + "</td></tr>";
    });
    table.innerHTML = "<table class='w-full text-left'><thead><tr class='text-sm text-slate-600 dark:text-slate-400'>" +
        "<th class='pb-2 pr-4'>Student</th><th class='pb-2 pr-4'>Marks</th><th class='pb-2'>Average</th></tr></thead>" +
        "<tbody>" + rows + "</tbody></table>";

    // Put names in with textContent so typed text is never run as HTML
    table.querySelectorAll("tbody tr").forEach((tr, i) => {
        tr.children[0].textContent = students[i].name;
    });
    box.appendChild(table);

    const classAvg = average(students.map(s => average(s.marks)));
    const p = document.createElement("p");
    p.className = "mt-4 pt-3 border-t border-slate-200 dark:border-slate-700";
    p.textContent = "Class average: " + classAvg.toFixed(2) + " (" + students.length + " students)";
    box.appendChild(p);
}

// ---- Buttons ----
document.getElementById("addBtn").addEventListener("click", addStudent);

document.getElementById("sampleBtn").addEventListener("click", () => {
    students.push(
        { name: "Amina", marks: [85, 90, 78] },
        { name: "Rafi", marks: [60, 72, 68] },
        { name: "Sara", marks: [95, 88, 92] }
    );
    showErrors([]);
    render();
});

document.getElementById("clearBtn").addEventListener("click", () => {
    students.length = 0;
    showErrors([]);
    render();
});

render();