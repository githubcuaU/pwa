import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "a",
  authDomain: "b",
  projectId: "c",
  storageBucket: "d",
  messagingSenderId: "e",
  appId: "f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getTasks(db) 
{
  const tasksCol = collection(db, "tasks");
  const taskSnapshot = await getDocs(tasksCol);
  const taskList = taskSnapshot.docs.map((doc) => doc);
  return taskList;
}

const unsub = onSnapshot(collection(db, "tasks"), (doc) => 
{

  doc.docChanges().forEach((change) => 
  {

    if (change.type === "added") 
    {
      // Call render function in UI
      renderTask(change.doc.data(), change.doc.id);
    }
    if (change.type === "removed") 
    {
      removeTask(change.doc.id);
    }
  });
});

// Add new task
const form = document.querySelector("form");
form.addEventListener("submit", (event) => 
{
  event.preventDefault();

  addDoc(collection(db, "tasks"), 
  {
    title: form.title.value,
    description: form.description.value,
  }).catch((error) => console.log(error));

  form.title.value = "";
  form.description.value = "";
});

// Delete task
const taskContainer = document.querySelector(".tasks");
taskContainer.addEventListener("click", (event) => 
{
  if (event.target.tagName === "I") 
  {
    const id = event.target.getAttribute("data-id");
    deleteDoc(doc(db, "tasks", id));
  }
});
