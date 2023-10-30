import React from "react";
import FormHeader from "../components/form/FormHeader";
import TextInput from "../components/form/TextInput";
import FormFooter from "../components/form/FormFooter";

const LoginPage = () => {
  return (
    <div className="flex h-screen">
      <div className="w-full max-w-xs m-auto bg-indigo-100 rounded p-5">
        <FormHeader text="Login Here." />
        <form>
          <TextInput
            labelText="Username"
            inputType="text"
            inputName="username"
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

export default LoginPage;
