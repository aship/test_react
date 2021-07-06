import React, { useContext } from "react";
import { Link } from "next/link";
import { useRouter } from "next/router";

import { makeStyles, Theme } from "@material-ui/core/styles";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonIcon from "@material-ui/icons/Person";
import SearchIcon from "@material-ui/icons/Search";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";

import { AuthContext } from "../context/auth";

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    flexGrow: 1,
    textDecoration: "none",
    color: "inherit",
  },
  linkBtn: {
    textTransform: "none",
    marginLeft: theme.spacing(1),
  },
}));

const Header = ({ childre, href }) => {
  const { loading, isSignedIn } = useContext(AuthContext);
  const classes = useStyles();

  // useEffect(() => {
  //     console.log('CHHHHHHHH')
  //     setName(currentUser?.name);
  //     setPrefecture(currentUser?.prefecture)
  //     setProfile(currentUser?.profile)

  // }, [currentUser])

  console.log("loading " + loading);
  console.log("isSignedIn " + isSignedIn);

  const router = useRouter();

  // const handleClick = (e) => {
  //    e.preventDefault()
  //    router.push(href)
  // }

  // 認証済みかどうかで表示ボタンを変更
  const AuthButtons = () => {
    if (!loading) {
      if (isSignedIn) {
        return (
          <>
            <IconButton
              onClick={() => router.push("/users")}
              edge="start"
              className={classes.linkBtn}
              color="inherit"
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              onClick={() => router.push("/chat_rooms")}
              edge="start"
              className={classes.linkBtn}
              color="inherit"
            >
              <ChatBubbleIcon />
            </IconButton>
            <IconButton
              onClick={() => router.push("/home")}
              edge="start"
              className={classes.linkBtn}
              color="inherit"
            >
              <PersonIcon />
            </IconButton>
          </>
        );
      } else {
        return (
          <>
            <IconButton
              onClick={() => router.push("/signin")}
              edge="start"
              className={classes.linkBtn}
              color="inherit"
            >
              <ExitToAppIcon />
            </IconButton>
          </>
        );
      }
    } else {
      return <></>;
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            component={Link}
            to="/users"
            variant="h6"
            className={classes.title}
          >
            Sample
          </Typography>
          <AuthButtons />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
