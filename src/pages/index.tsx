import Home from "./home";

function Index() {
  const isSignedIn = false;
  const currentUser = true;

  return (
    // prettier-ignore
    <>
      {isSignedIn && currentUser ? (
      <div>
        <ul>
          <li><a href="signup">signup</a></li>
          <li><a href="signin">signin</a></li>
        </ul>
      </div>
      ) : (
      <Home>
      </Home>
      )}
    </>
  );
}

export default Index;
