import { useState, useEffect } from "react";
import { Link } from "next/link";
import useSWR from "swr";
import Cookies from "js-cookie";

import { makeStyles, Theme } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

//import { getChatRooms } from "../lib/api/chat_rooms"
import { ChatRoom } from "interfaces/index";

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
  root: {
    flexGrow: 1,
    minWidth: 340,
    maxWidth: "100%",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
}));

// チャットルーム一覧ページ
function ChatRooms() {
  const classes = useStyles();

  // prettier-ignore
  const { data, error } = useSWR("http://localhost:3001/api/v1/chat_rooms", fetcher);

  const [loading, setLoading] = useState<boolean>(true);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  // const handleGetChatRooms = async () => {
  //   try {
  //     const res = await getChatRooms();

  //     if (res.status === 200) {
  //       setChatRooms(res.data.chatRooms);
  //     } else {
  //       console.log("No chat rooms");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }

  //   setLoading(false);
  // };

  // useEffect(() => {
  //   handleGetChatRooms();
  // }, []);

  console.log("loading " + loading);
  console.log("chatRooms?.length1: " + data?.chat_rooms?.length);

  if (error) return <div>failed to load {error.status}</div>;
  if (!data) return <div>loading...</div>;

  console.log("chatRooms.length2: " + data.chat_rooms?.length);

  for (let cr in data.chat_rooms) {
    console.log("chatRooms3: " + cr); //);
  }

  return (
    <>
      {true ? (
        data.chat_rooms?.length > 0 ? (
          data.chat_rooms.map((chat_room: ChatRoom, index: number) => {
            return (
              <Grid container key={index} justify="center">
                <List>
                  <a href={"/chat_rooms/" + chat_room.chat_room.id}>
                    <div className={classes.root}>
                      <ListItem alignItems="flex-start" style={{ padding: 0 }}>
                        <ListItemAvatar>
                          <Avatar
                            alt="avatar"
                            src={chat_room.other_user.image.url}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={chat_room.other_user.name}
                          secondary={
                            <div style={{ marginTop: "0.5rem" }}>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textSecondary"
                              >
                                {chat_room.last_message === null
                                  ? "まだメッセージはありません。"
                                  : chat_room.last_message.content.length > 30
                                  ? chat_room.last_message.content.substr(
                                      0,
                                      30
                                    ) + "..."
                                  : chat_room.last_message.content}
                              </Typography>
                            </div>
                          }
                        />
                      </ListItem>
                    </div>
                  </a>
                  <Divider component="li" />
                </List>
              </Grid>
            );
          })
        ) : (
          <Typography component="p" variant="body2" color="textSecondary">
            マッチング中の相手はいません。
          </Typography>
        )
      ) : (
        <></>
      )}
    </>
  );
}

export default ChatRooms;
