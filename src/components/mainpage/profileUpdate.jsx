import React, { useState, useRef, useRecoilValue } from "react";
import style from "../../componentcss/Mainpage.module.css";
import { useRecoilState } from "recoil";
import {
  userId,
  userprofileData,
  chatVisibility,
  editProfileVisibility,
} from "../../recoil/atom";
import Avatar from "@mui/material/Avatar";
import { Icon } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Swal from "sweetalert2";
import axios from "axios";
import Button from "@mui/material/Button";
import BorderColorIcon from '@mui/icons-material/BorderColor';

function EditProfile() {
  const [userData, setUserData] = useRecoilState(userprofileData);
  const [profileImage, setprofileImage] = useState(userData.profileImage);
  const [profileName, setprofileName] = useState(userData.name);
  const [userid, setUserId] = useRecoilState(userId);
  const [chatVisible, setChatVisible] = useRecoilState(chatVisibility);
  const [editProfileVisibile, setEditProfileVisibile] = useRecoilState(
    editProfileVisibility
  );
  const [file, setFile] = useState(null);
  const [editName, setEditName] = useState("");
  const [editNameVisiblity, setEditNameVisiblity] = useState(false);

  //-----------------------------upload
  const [image, setImage] = useState(null);
  const inputRef = useRef(null);
  async function handleChange(e) {
    setImage(profileImage);
    setFile(e.target.files[0]);
    
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result);
      };
    }
  }
  function handleClick() {
    inputRef.current.click();
  }

  const handleUpdate = async () => {
    if (file||editName!='') {
      const formData = new FormData();
      if(file){
      formData.append("image", file, file.name);
      }
      if (editName !== "") {
        formData.append("name", editName);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      };

      let responseData = await axios
        .put(`http://localhost:4000/user/${userid}/update`, formData, config)
        .then((response) => response)
        .catch((error) => error);

      if (responseData.status) {
        setUserData({ ...userData, ...responseData.data.data });
        //  setprofileImage(responseData.data.data.profileImage);
        setImage("");

        Swal.fire(responseData.data.message);
        setChatVisible(true);
        setEditProfileVisibile(false);
        setImage("");
        setEditName("");
      }
      if (!responseData.data.status) {
        // show and handle error
        Swal.fire("please check your image");
      }
    } else {
      Swal.fire("please select some file to upload");
    }
  };

  //------------------------

  const handleCancel = () => {
    setEditName("");

    setChatVisible(true);
    setEditProfileVisibile(false);
    setEditNameVisiblity(false);
  };

  return (
    <div className={style.ProfilemainCard}>
      <div className={style.profileEditCard}>
        <div className={style.image2}>
          {profileImage != "" ? (
            <Avatar
              src={profileImage}
              sx={{ width: 220, height: 216, fontSize: "5rem" }}
              alt="image"
            ></Avatar>
          ) : (
            <Avatar
              src="https://classroom-training-bucket.s3.ap-south-1.amazonaws.com/profileImage/alex-knight-2EJCSULRwC8-unsplash__1_-removebg-preview.png"
              sx={{ width: 220, height: 216, fontSize: "5rem" }}
            ></Avatar>
          )}
        </div>
        <input type="file" hidden onChange={handleChange} ref={inputRef} />
        <div onClick={handleClick} className={style.icon}>
          
          <label>upload image</label>
          <Icon>
            <FileUploadIcon />
          </Icon>
        </div>
        <div className={style.userName}>
          <label className={style.editUserName}>{profileName}</label>
        </div>
        {editNameVisiblity ? (
          <div>
            <input className={style.editInput}
              value={editName}
              type="text"
              placeholder="enter your name"
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>
        ) : (
          ""
        )}
        <div
          onClick={() => {
            setEditNameVisiblity(editNameVisiblity ? false : true);
          }}
          className={style.icon}
        >
          
          <label>edit name</label>
          <Icon>
            <EditIcon />
          </Icon>
        </div>

        <div className={style.updateCancleButton}>
          <Button
            variant="contained"
            type="submit"
            className={style.submitChat}
            onClick={handleUpdate}
          >
            update
          </Button>
          <Button
            variant="contained"
            type="submit"
            className={style.submitChat}
            onClick={handleCancel}
          >
            cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
export default EditProfile;
