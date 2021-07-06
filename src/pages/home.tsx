import { useContext } from "react";

import Lolo from "components/home/lolo";
import HomeMain from "components/home/home_main";

import { AuthContext } from "context/auth";

function Home() {
  const { isSignedIn, currentUser } = useContext(AuthContext);

  return <>{isSignedIn && currentUser ? <HomeMain /> : <Lolo />}</>;
}

export default Home;
