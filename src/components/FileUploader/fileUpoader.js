import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "@actions/actions";
import { clearMedia } from "@reducers/mediaSlice";

import { Button, IconButton, Box } from "@mui/material";

import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import PhotoSizeSelectActualOutlinedIcon from "@mui/icons-material/PhotoSizeSelectActualOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import AudiotrackOutlinedIcon from '@mui/icons-material/AudiotrackOutlined';
import { Loader } from "../Loader/loader.js";

import styles from "./fileUploader.module.scss";
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export const FileUploader = ({ type, media }) => {
  const t = useTranslations("createSteps");

  const fiveMB = 5242880;
  const maxFileSize = fiveMB;

  const { isLoading } = useSelector((state) => state.mediaReducer);

  const imageAccept = "image/png, image/jpg, image/jpeg";
  const audioAccept = "audio/mp3, audio/wav, audio/webm";
  const filePiker = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const dispatch = useDispatch();

  const isFileSizeOk = selectedFile?.size < maxFileSize ? true : false;

  let accept = type === "image" ? imageAccept : audioAccept;

  const handleChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("file", selectedFile);

    if (isFileSizeOk) {
      dispatch(uploadFile(formData));
    }
    setSelectedFile(null);
  };
  const handlePick = () => {
    filePiker.current.click();
  };

  const handleDelete = () => {
    dispatch(clearMedia());
    setSelectedFile(null);
  };

  const getSizeInMB = (size) => {
    const sizeInMB = ((size / 1024) / 1024);
    return sizeInMB.toFixed(3);
  }

  return (
    <Box component="div" sx={{ width: 1, minHeight: 100, mb: 4 }}>
      <Box
        component="div"
        sx={{
          width: 1,
          display: "flex",
          justifyContent: "space-around",
          mt: 2,
        }}
      >
        <Button variant="contained" onClick={handlePick}>
          {t("select_file")}
        </Button>

        <input
          className={styles.hidden}
          type="file"
          ref={filePiker}
          onChange={handleChange}
          accept={accept}
        />

        <Button
          disabled={!selectedFile}
          variant="contained"
          endIcon={<UploadFileOutlinedIcon />}
          onClick={handleUpload}
        >
          {t("upload")}
        </Button>
      </Box>

      {selectedFile && (
        <div className={styles.preview}>
          {type === "image" && (
            <PhotoSizeSelectActualOutlinedIcon sx={{ mr: 2 }} />
          )}
          {type === "sound" && (
            <AudiotrackOutlinedIcon sx={{ mr: 2 }} />
          )}
          {selectedFile.name} {getSizeInMB(selectedFile.size)} {t("mb")}
        </div>
      )}
      {selectedFile && !isFileSizeOk && (
        <div className={styles.notification}>
          {t("file_size_exceed")}
        </div>
      )}

      {isLoading && <Loader />}

      {!isLoading && media && (
        <>
          {media.link && type === "image" && (
            <div className={styles.file}>
              <Image
                className={styles.file__img}
                alt="задание в виде картинки"
                src={`${media.link}`}
                width="100"
                height="100"
              />
              <div className={styles.file__text}>{media.filename}</div>
              <IconButton
                sx={{ color: "#ff6090", ml: 2 }}
                onClick={handleDelete}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </div>
          )}
          {media.link && type === "sound" && (
            <div className={styles.file}>
              <audio controls>
                <source src={`${media.link}`} type="audio/mp3" />
                <source src={`${media.link}`} type="audio/wav" />
                <source src={`${media.link}`} type="audio/webm" />
              </audio>

              <IconButton
                sx={{ color: "#ff6090", ml: { xs: 0, sm: 2 } }}
                onClick={handleDelete}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </div>
          )}
        </>
      )}
    </Box>
  );
};
