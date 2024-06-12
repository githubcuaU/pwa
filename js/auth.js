import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import 
{
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBisSfkHQ0fKSRZ4HSZIn0v_xk2alDbsvo",
  authDomain: "tasks-f99e0.firebaseapp.com",
  projectId: "tasks-f99e0",
  storageBucket: "tasks-f99e0.appspot.com",
  messagingSenderId: "879419221659",
  appId: "1:879419221659:web:d621fa85c7b4aa48f9483e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Listen for auth status changes
onAuthStateChanged(auth, (user) => 
{
  // Check for user status
  if (user) 
  {
    console.log("User log in: ", user.email);
    getTasks(db).then((snapshot) => 
    {
        setupTasks(snapshot);
    });

    setupUI(user);
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
  } 
  
  else 
  {
    // console.log("User Logged out");
    setupUI();
    setupTasks([]);
  }
});

// Signup
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => 
{
  e.preventDefault();

  // Get user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => 
    {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    })
    .catch((error) => 
    {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});

// Logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => 
{
  e.preventDefault();
  signOut(auth)
    .then(() => 
    {
      // console.log("user has signed out");
    })
    .catch((error) => 
    {
      // An error happened.
    });
});

// Login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => 
{
  e.preventDefault();
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => 
    {
      // Signed in
      const user = userCredential.user;

      // Close the login modal and reset the form
      const modal = document.querySelector("#modal-login");
      M.Modal.getInstance(modal).close();
      loginForm.reset();
    })
    .catch((error) => 
    {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});
