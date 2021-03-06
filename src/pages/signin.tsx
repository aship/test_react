import React, { useState, useEffect, useContext } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import Box from "@material-ui/core/Box";
import CancelIcon from "@material-ui/icons/Cancel";
import Typography from "@material-ui/core/Typography";

import { AuthContext } from "../context/auth";
import AlertMessage from "../components/utils/AlertMessage";
import { signIn } from "../lib/api/auth";
import { SignInData } from "../interfaces/index";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: theme.spacing(6),
  },
  submitBtn: {
    marginTop: theme.spacing(1),
    flexGrow: 1,
    textTransform: "none",
  },
  header: {
    textAlign: "center",
  },
  card: {
    padding: theme.spacing(2),
    maxWidth: 340,
  },
  inputFileButton: {
    textTransform: "none",
    color: theme.palette.primary.main,
  },
  imageUploadBtn: {
    textAlign: "right",
  },
  input: {
    display: "none",
  },
  box: {
    marginBottom: "1.5rem",
  },
  preview: {
    width: "100%",
  },
}));

function Signin() {
  const classes = useStyles();
  const router = useRouter();

  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const data: SignInData = {
      email: email,
      password: password,
    };

    try {
      const res = await signIn(data);
      console.log(res);

      if (res.status === 200) {
        // ????????????????????????????????????Cookie?????????????????????
        Cookies.set("_access_token", res.headers["access-token"]);
        Cookies.set("_client", res.headers["client"]);
        Cookies.set("_uid", res.headers["uid"]);

        setIsSignedIn(true);
        setCurrentUser(res.data.data);

        router.push("/home");

        setEmail("");
        setPassword("");

        console.log("Signed in successfully!");
      } else {
        setAlertMessageOpen(true);
      }
    } catch (err) {
      console.log(err);
      setAlertMessageOpen(true);
    }
  };

  return (
    <>
      <form noValidate autoComplete="off">
        <Card className={classes.card}>
          <CardHeader className={classes.header} title="???????????????" />
          <CardContent>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="?????????????????????"
              value={email}
              margin="dense"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="???????????????"
              type="password"
              placeholder="??????6????????????"
              value={password}
              margin="dense"
              autoComplete="current-password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            <div style={{ textAlign: "right" }}>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                disabled={!email || !password ? true : false} // ????????????????????????????????????????????????????????????
                className={classes.submitBtn}
                onClick={handleSubmit}
              >
                ??????
              </Button>
            </div>
            <Box textAlign="center" className={classes.box}>
              <Typography variant="body2">
                ????????????????????????????????????????????????
                <a href="/signup" className={classes.link}>
                  ?????????
                </a>
                ?????????????????????????????????
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </form>
      <AlertMessage // ??????????????????????????????????????????????????????
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message="???????????????????????????????????????????????????????????????"
      />
    </>
  );
}

export default Signin;
