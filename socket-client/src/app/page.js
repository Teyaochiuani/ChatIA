"use client";
import Image from "next/image";
import { Stack, Typography, TextField, Button, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PhotoCamera from "@mui/icons-material/PhotoCamera"; // Import the icon for the upload button
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import dayjs from "dayjs";

const socket = io("ws://localhost:9002", {
  reconnectionDelayMax: 1000,
});

export default function Home() {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [list, setList] = useState([]);

  function onClick() {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        socket.emit("message", {
          id: socket.id,
          message,
          image: reader.result,
          date: new Date(),
        });
        setMessage("");
        setImage(null);
      };
      reader.readAsDataURL(image);
    } else {
      const text = message;
      setMessage("");
      socket.emit("message", {
        id: socket.id,
        message: text,
        date: new Date(),
      });
    }
  }

  useEffect(() => {
    socket.on("listMessage", (message) => {
      setList((prevList) => prevList.concat(message));
    });

    return () => {
      socket.off("listMessage");
    };
  }, []);

  return (
    <Stack sx={{ height: "100%" }}>
      <Stack
        sx={{
          height: "60px",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#EEE",
          flexShrink: 0,
        }}
      >
        <Typography>Online chat</Typography>
      </Stack>
      <Stack sx={{ backgroundColor: "orange", flexGrow: 1, width: "100%" }} pt={1} spacing={2}>
        {list.map((item, index) => (
          <Stack
            key={index.toString()}
            sx={{
              maxWidth: "60%",
              backgroundColor: "white",
              borderRadius: "25px",
              minHeight: "30px",
              alignSelf: item.id === socket.id ? "end" : "start",
              p: 1,
              px: 2,
            }}
          >
            {item.image ? (
              <img src={item.image} alt="sent image" style={{ maxWidth: "100%" }} />
            ) : (
              <Typography>{item.message}</Typography>
            )}
            <Typography variant="caption" color="textSecondary">
              {dayjs(item.date).format("DD/MM/YYYY HH:mm:ss")}
            </Typography>
          </Stack>
        ))}
      </Stack>
      <Stack sx={{ height: "60px", alignItems: "center" }} direction="row" spacing={2}>
        <TextField label="Escribe tu mensaje" variant="standard" fullWidth value={message} onChange={(event) => setMessage(event.target.value)} />
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="icon-button-file"
          onChange={(event) => setImage(event.target.files[0])}
        />
        <label htmlFor="icon-button-file">
          <IconButton color="primary" aria-label="upload picture" component="span">
            <PhotoCamera />
          </IconButton>
        </label>
        <Button variant="contained" endIcon={<SendIcon />} onClick={onClick}>
          Send
        </Button>
      </Stack>
    </Stack>
  );
}
