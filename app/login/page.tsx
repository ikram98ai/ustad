"use client";
import FormHeader from "../components/form/FormHeader";
import FormFooter from "../components/form/FormFooter";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styles from "../styleObj";

const LoginPage = () => {
  const formInit = {
    email: "",
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
            <FormHeader text="Login Here." />
            <Field
              className={styles.textInput}
              name="email"
              type="email"
              placeholder="Email..."
            />
            <ErrorMessage name="email"/>
            <Field
              className={styles.textInput}
              name="password"
              type="password"
              placeholder="Password..."
            />
            <input className={styles.submitBtn} type="submit" />
            <FormFooter
              leftLink="#"
              leftText="Forgot Password?"
              rightLink="/signup"
              rightText="Create Account"
            />
          </div>
        </div>
      </Form>
    </Formik>
  );
};

export default LoginPage;
