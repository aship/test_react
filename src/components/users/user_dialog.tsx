import { useState } from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { Grid, Typography } from "@material-ui/core";

import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";

import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";

import { prefectures } from "const/prefectures";
import { getLikes, createLike } from "lib/api/likes";

function UserDialog(props) {
  // 生年月日から年齢を計算する 年齢 = floor((今日 - 誕生日) / 10000)
  const userAge = (): number | void => {
    const birthday = props.user.birthday.toString().replace(/-/g, "");
    if (birthday.length !== 8) return;

    const date = new Date();
    const today =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2);

    return Math.floor((parseInt(today) - parseInt(birthday)) / 10000);
  };

  const userPrefecture = (): string => {
    return prefectures[props.user.prefecture - 1];
  };

  // すでにいいねを押されているユーザーかどうかの判定
  const isLikedUser = (userId: number | undefined): boolean => {
    return props.likedUsers?.some((likedUser: User) => likedUser.id === userId);
  };

  // いいね作成
  const handleCreateLike = async (user: User) => {
    const data: Like = {
      fromUserId: props.currentUser?.id,
      toUserId: user.id,
    };

    const res = await createLike(data);
    console.log(res);

    if (res?.status === 200) {
      setLikes([res.data.like, ...likes]);
      props.setLikedUsers([user, ...props.likedUsers]);

      console.log(res?.data.like);
    } else {
      console.log("Failed");
    }

    if (res?.data.isMatched === true) {
      setAlertMessageOpen(true);
      setUserDetailOpen(false);
    }
  };

  const [likes, setLikes] = useState<Like[]>([]);

  return (
    <Dialog
      open={props.userDetailOpen}
      keepMounted
      onClose={() => props.setUserDetailOpen(false)}
    >
      <DialogContent>
        <Grid container justify="center">
          <Grid item>
            <Avatar
              alt="avatar"
              src={props.user?.image.url}
              className={props.classes.avatar}
            />
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Grid item style={{ marginTop: "1rem" }}>
            <Typography
              variant="body1"
              component="p"
              gutterBottom
              style={{ textAlign: "center" }}
            >
              {props.user.name} {userAge()}歳 ({userPrefecture()})
            </Typography>
            <Divider />
            <Typography
              variant="body2"
              component="p"
              gutterBottom
              style={{ marginTop: "0.5rem", fontWeight: "bold" }}
            >
              自己紹介
            </Typography>
            <Typography
              variant="body2"
              component="p"
              color="textSecondary"
              style={{ marginTop: "0.5rem" }}
            >
              {props.user.profile
                ? props.user.profile
                : "よろしくお願いします。"}
            </Typography>
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Button
            variant="outlined"
            onClick={() =>
              isLikedUser(props.user.id) ? void 0 : handleCreateLike(props.user)
            }
            color="secondary"
            startIcon={
              isLikedUser(props.user.id) ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )
            }
            disabled={isLikedUser(props.user.id) ? true : false}
            style={{ marginTop: "1rem", marginBottom: "1rem" }}
          >
            {isLikedUser(props.user.id) ? "いいね済み" : "いいね"}
          </Button>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default UserDialog;
