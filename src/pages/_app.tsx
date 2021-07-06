import React, { useState, useEffect, createContext } from "react";

import "../styles/globals.css";
import type { AppProps } from "next/app";

import { Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Header from "./header";
import { AuthContext } from "../context/auth";

import { getCurrentUser } from "../lib/api/auth";
import { User } from "../interfaces/index";

const useStyles = makeStyles(() => ({
  container: {
    marginTop: "3rem",
  },
}));

function MyApp({ Component, pageProps }: AppProps) {
  const classes = useStyles();

  const [loading, setLoading] = useState<boolean>(true);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  const handleGetCurrentUser = async () => {
    console.log("TRYYY handleGetCurrentUser");

    try {
      const res = await getCurrentUser();
      console.log(res);

      if (res?.status === 200) {
        setIsSignedIn(true);

        // console.log("EEEEEE")
        // console.log(res?.data.currentUser)

        setCurrentUser(res?.data.currentUser);

        // console.log("EEEEEE2")
        // console.log(currentUser)
      } else {
        console.log("No current user");
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log("UUUUSE EFFFECT APP");
    handleGetCurrentUser();
  }, [setCurrentUser]);

  return (
    <>
      <AuthContext.Provider
        value={{
          loading,
          isSignedIn,
          setIsSignedIn,
          currentUser,
          setCurrentUser,
        }}
      >
        <header>
          <Header />
        </header>
        <main>
          <Container maxWidth="lg" className={classes.container}>
            <Grid container justify="center">
              <Component {...pageProps} />
            </Grid>
          </Container>
        </main>
      </AuthContext.Provider>
    </>
  );
}

export default MyApp;
