import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Cookies from "js-cookie";

import { makeStyles, Theme } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";

import { createMessage } from "../../lib/api/messages";
import { User, Message } from "../../interfaces/index";

import { AuthContext } from "../../context/auth";

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
    margin: "0 auto",
  },
  formWrapper: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 340,
  },
  textInputWrapper: {
    width: "100%",
  },
  button: {
    marginLeft: theme.spacing(1),
  },
}));

export async function getServerSideProps(context) {
  console.log("EESSSSSSEVER SIDES");
  const { id } = context.query;

  const url = "http://localhost:3001/api/v1/chat_rooms/" + id;
  const res = await fetch(url);
  const data = await res.json();

  return { props: { data } };
}

function ChatRooms(props) {
  const classes = useStyles();
  const router = useRouter();

  const { currentUser } = useContext(AuthContext);
  const { id } = router.query;

  // const url = "http://localhost:3001/api/v1/chat_rooms/" + id
  // const { data, error } = useSWR(id ? url : null, id ? fetcher : null);
  //  let other_user =

  const [other_user, setother_user] = useState<User>(props.data.other_user);
  const [messages, setMeesages] = useState<Message[]>(props.data.messages);
  const [content, setContent] = useState<string>("");

  //  console.log("idddd: " + id)

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const data: Message = {
      chatRoomId: id,
      userId: currentUser?.id,
      content: content,
    };

    try {
      const res = await createMessage(data);
      console.log(res);

      if (res.status === 200) {
        setMeesages([...messages, res.data.message]);
        setContent("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Railsから渡ってくるtimestamp（ISO8601）をdatetimeに変換
  const iso8601ToDateTime = (iso8601: string) => {
    const date = new Date(Date.parse(iso8601));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return (
      year + "年" + month + "月" + day + "日" + hour + "時" + minute + "分"
    );
  };

  //  console.log("data?.other_user.length : " + data?.other_user.length)

  //console.log("data?.other_user : " + data?.other_user)

  // if (error) return <div>failed to load {error.status}</div>;
  // if (!data) return <div>loading...</div>;

  // if (data.messages) {
  //   setMeesages(data.messages)
  // }

  return (
    <>
      {other_user ? (
        <div style={{ maxWidth: 360 }}>
          <Grid container justify="center" style={{ marginBottom: "1rem" }}>
            <Grid item>
              <Avatar
                alt="avatar"
                src={other_user?.image.url || ""}
                className={classes.avatar}
              />
              <Typography
                variant="body2"
                component="p"
                gutterBottom
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                {other_user?.name}
              </Typography>
            </Grid>
          </Grid>
          {messages.map((message: Message, index: number) => {
            return (
              <Grid
                key={index}
                container
                justify={
                  message.user_id === other_user?.id ? "flex-start" : "flex-end"
                }
              >
                <Grid item>
                  <Box
                    borderRadius={
                      message.user_id === other_user?.id
                        ? "30px 30px 30px 0px"
                        : "30px 30px 0px 30px"
                    }
                    bgcolor={
                      message.user_id === other_user?.id ? "#d3d3d3" : "#ffb6c1"
                    }
                    color={
                      message.user_id === other_user?.id ? "#000000" : "#ffffff"
                    }
                    m={1}
                    border={0}
                    style={{ padding: "1rem" }}
                  >
                    <Typography variant="body1" component="p">
                      {message.content}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    component="p"
                    color="textSecondary"
                    style={{
                      textAlign:
                        message.user_id === other_user?.id ? "left" : "right",
                    }}
                  >
                    {iso8601ToDateTime(
                      message.created_at
                        ? message.created_at.toString()
                        : message.createdAt
                    )}
                  </Typography>
                </Grid>
              </Grid>
            );
          })}
          <Grid container justify="center" style={{ marginTop: "2rem" }}>
            <form className={classes.formWrapper} noValidate autoComplete="off">
              <TextField
                required
                multiline
                value={content}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setContent(e.target.value)
                }
                className={classes.textInputWrapper}
              />
              <Button
                variant="contained"
                color="primary"
                disabled={!content ? true : false}
                onClick={handleSubmit}
                className={classes.button}
              >
                <SendIcon />
              </Button>
            </form>
          </Grid>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default ChatRooms;
