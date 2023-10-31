"use client";
import FormHeader from "../components/form/FormHeader";
import FormFooter from "../components/form/FormFooter";
import { Field, Form, Formik } from "formik";
import styles from "../styleObj";

const SignupPage = () => {
  const formInit = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneContact: "",
    password: "",
  };

  return (
    <Formik
      initialValues={formInit}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      <Form>
        <div className="flex h-screen">
          <div className="w-full max-w-xs m-auto bg-indigo-100 rounded p-5">
            <FormHeader text="Signup Here." />
            <Field
              name="firstName"
              type="text"
              className={styles.textInput}
              placeholder="First Name..."
            />
            <Field
              name="lastName"
              type="text"
              className={styles.textInput}
              placeholder="Last Name..."
            />
            <Field
              name="email"
              type="email"
              className={styles.textInput}
              placeholder="Email..."
            />
            <Field
              name="contact"
              type="tel"
              className={styles.textInput}
              placeholder="Phone Contact..."
            />

            <Field
              className={styles.textInput}
              name="password"
              type="password"
              placeholder="Password..."
            />
            <input
              className="w-full bg-indigo-700 hover:bg-green-600 text-white font-bold py-2 px-4 mb-6 rounded"
              type="submit"
            />

            <FormFooter rightLink="/login" rightText="Login Your Account" />
          </div>
        </div>
      </Form>
    </Formik>
  );
};

export default SignupPage;
