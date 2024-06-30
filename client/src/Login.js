import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./Login.css";

const Login = ({ user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUpActive, setIsSignUpActive] = useState(true);

  const handleMethodChange = () => {
    setIsSignUpActive(!isSignUpActive);
  };

  const handleSignUp = () => {
    if (!email || !password) return;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const handleSignIn = () => {
    if (!email || !password) return;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  if (user) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="login-page__container">
      <section className="login-page">
        <form className="login-page__form">
          {isSignUpActive && <legend className="login-page__legend">Sign Up</legend>}
          {!isSignUpActive && <legend className="login-page__legend">Sign In</legend>}

          <fieldset className="login-page__fieldset">
            <ul className="login-page__list">
              <li className="login-page__item">
                <label htmlFor="email" className="login-page__label">Email</label>
                <input type="text" id="email" onChange={handleEmailChange} className="login-page__input" />
              </li>
              <li className="login-page__item">
                <label htmlFor="password" className="login-page__label">Password</label>
                <input
                  type="password"
                  id="password"
                  onChange={handlePasswordChange}
                  className="login-page__input"
                />
              </li>
            </ul>

            {isSignUpActive && (
              <button type="button" onClick={handleSignUp} className="login-page__button">
                Sign Up <span className="login-page__spinner"></span>
              </button>
            )}
            {!isSignUpActive && (
              <button type="button" onClick={handleSignIn} className="login-page__button">
                Sign In <span className="login-page__spinner"></span>
              </button>
            )}
          </fieldset>
          {isSignUpActive && <a onClick={handleMethodChange} className="login-page__link">Login</a>}
          {!isSignUpActive && (
            <a onClick={handleMethodChange} className="login-page__link">Create an account</a>
          )}
        </form>
      </section>
    </div>
  );
};

export default Login;
