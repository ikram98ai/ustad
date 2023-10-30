import React from "react";
import FormHeader from "../components/form/FormHeader";
import TextInput from "../components/form/TextInput";
import FormFooter from "../components/form/FormFooter";

const SignupPage = () => {
  return (
    <div className="flex mb-20">
      <div className="w-full max-w-xs m-auto bg-indigo-100 rounded p-5">
        <FormHeader text="Signup Here." />
        <form>
          <TextInput
            labelText="First Name"
            inputType="text"
            inputName="firstName"
          />
          <TextInput
            labelText="Last Name"
            inputType="text"
            inputName="lastName"
          />
          <TextInput
            labelText="Username"
            inputType="text"
            inputName="username"
          />
          <TextInput
            labelText="Email"
            inputType="email"
            inputName="email"
          />
          <TextInput
            labelText="Phone Contact"
            inputType="tel"
            inputName="phoneContact"
          />
          <TextInput
            labelText="Password"
            inputType="password"
            inputName="password"
          />

          <div>
            <input
              className="w-full bg-indigo-700 hover:bg-green-600 text-white font-bold py-2 px-4 mb-6 rounded"
              type="submit"
            />
          </div>
        </form>
        <FormFooter
          leftLink="#"
          leftText="Forgot Password?"
          rightLink="/signup"
          rightText="Create Account"
        />
      </div>
    </div>
  );
};

export default SignupPage;
