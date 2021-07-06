import React, { useState, useEffect, useContext } from "react";
import useSWR from "swr";
import Cookies from "js-cookie";
import * as cookie from "cookie";

import { makeStyles, Theme } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";

import Avatar from "@material-ui/core/Avatar";

import UserDialog from "components/users/user_dialog";

import AlertMessage from "components/utils/AlertMessage";

import { AuthContext } from "context/auth";

import { User, Like } from "interfaces/index";

const fetcher = async (url) => {
  const res = await fetch(url, {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));

export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie);

  const url = "http://localhost:3001/api/v1/likes";
  const res = await fetch(url, {
    headers: {
      "access-token": cookies._access_token,
      client: cookies._client,
      uid: cookies._uid,
    },
  });

  const dataLikes = await res.json();
  return { props: { dataLikes } };
}

function Users(props) {
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();

  const initialUserState: User = {
    id: 0,
    uid: "",
    provider: "",
    email: "",
    name: "",
    image: {
      url: "",
    },
    gender: 0,
    birthday: "",
    profile: "",
    prefecture: 13,
    allowPasswordChange: true,
  };

  const { data, error } = useSWR("http://localhost:3001/api/v1/users", fetcher);

  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>(initialUserState);
  const [userDetailOpen, setUserDetailOpen] = useState<boolean>(false);

  const active_likes = props.dataLikes.active_likes;

  const [likedUsers, setLikedUsers] = useState<User[]>(active_likes);

  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  console.log("loading " + loading);
  console.log("users?.length1 " + data?.users?.length);

  if (error) return <div>failed to load {error.status}</div>;
  if (!data) return <div>loading...</div>;

  console.log("users.length2: " + data.users?.length);

  return (
    <>
      {data.users?.length > 0 ? (
        <Grid container justify="center">
          {data.users?.map((user: User, index: number) => {
            return (
              <div
                key={index}
                onClick={() => {
                  setUser(user);
                  setUserDetailOpen(true);
                }}
              >
                <Grid item style={{ margin: "0.5rem", cursor: "pointer" }}>
                  <Avatar
                    alt="avatar"
                    src={user?.image.url}
                    className={classes.avatar}
                  />
                  <Typography
                    variant="body2"
                    component="p"
                    gutterBottom
                    style={{ marginTop: "0.5rem", textAlign: "center" }}
                  >
                    {user.name}
                  </Typography>
                </Grid>
              </div>
            );
          })}
        </Grid>
      ) : (
        <Typography component="p" variant="body2" color="textSecondary">
          まだ1人もユーザーがいません。
        </Typography>
      )}
      <UserDialog
        userDetailOpen={userDetailOpen}
        user={user}
        classes={classes}
        setUserDetailOpen={setUserDetailOpen}
        currentUser={currentUser}
        setLikedUsers={setLikedUsers}
        likedUsers={likedUsers}
      />
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="success"
        message="マッチングが成立しました!"
      />
    </>
  );
}

export default Users;
