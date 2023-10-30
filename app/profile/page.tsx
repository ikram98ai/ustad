import LoginPage from "../login/page";

const ProfilePage = () => {
  const user = "ikram";

  return user ? <LoginPage /> : <div>Profile Page</div>;
};

export default ProfilePage;
