const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");

let notes = [];

function render() {
  notesList.replaceChildren();

  notes.forEach((note) => {
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

    noteMeta.append(categoryLabel, createdAt);
    noteItem.append(noteText, noteMeta);
    notesList.append(noteItem);
  });
}

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = noteInput.value.trim();
  if (!text) {
    return;
  }

  notes.push({
    id: crypto.randomUUID(),
    text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString()
  });

  noteInput.value = "";
  render();
});
