const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const clearAllButton = document.querySelector("#clear-all-button");
const savedNotes = localStorage.getItem("quicknotes");

let notes = savedNotes === null ? [] : JSON.parse(savedNotes);

if (!Array.isArray(notes)) {
  throw new TypeError("Saved notes must be an array.");
}

function saveNotes() {
  localStorage.setItem("quicknotes", JSON.stringify(notes));
}

function render() {
  notesList.replaceChildren();

  const query = searchInput.value.trim().toLowerCase();
  const visibleNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(query)
  );

  visibleNotes.forEach((note) => {
    const noteItem = document.createElement("li");
    noteItem.classList.add(
      "note-card",
      `category-${note.category.toLowerCase()}`
    );

    const noteText = document.createElement("p");
    noteText.textContent = note.text;

    const noteMeta = document.createElement("div");
    noteMeta.classList.add("note-meta");

    const categoryLabel = document.createElement("span");
    categoryLabel.classList.add("note-category-label");
    categoryLabel.textContent = note.category;

    const createdAt = document.createElement("time");
    createdAt.textContent = note.createdAt;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete note: ${note.text}`);
    deleteButton.addEventListener("click", () => {
      notes = notes.filter((item) => item.id !== note.id);
      saveNotes();
      render();
    });

    noteMeta.append(categoryLabel, createdAt, deleteButton);
    noteItem.append(noteText, noteMeta);
    notesList.append(noteItem);
  });

  if (query && visibleNotes.length === 0) {
    const noResults = document.createElement("li");
    noResults.textContent = "No notes match your search.";
    notesList.append(noResults);
  }

  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = noteInput.value.trim();
  if (!text) {
    errorMessage.textContent = "Please type a note first.";
    return;
  }
  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  errorMessage.textContent = "";
  notes.push({
    id: crypto.randomUUID(),
    text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString()
  });

  saveNotes();
  noteInput.value = "";
  render();
});

searchInput.addEventListener("input", render);

clearAllButton.addEventListener("click", () => {
  if (confirm("Delete all notes?")) {
    notes = [];
    saveNotes();
    render();
  }
});

render();
