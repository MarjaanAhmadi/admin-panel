import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "./resetPassword.css";
import { withNamespaces } from "react-i18next";
import axiosInstance from "../../routing/axios";
import { toast } from "react-toastify";
import i18next from "i18next";

const ResetPassword = (props) => {



  const [changePass, setChangePass] = useState({
    old_password: null,
    new_password1: null,
    new_password2: null
  });

  //pass characters should be 8
  //new pass should match old pass
  //no fields shouldn't be null
  //
  const changeValidations = () => {
    if (
      changePass.old_password == null ||
      changePass.new_password1 == null ||
      changePass.new_password2 == null
    ) {
      toast.error("وارد کردن همه ی فیلدها اجباری است.");
      return true;
    }
    if (
      changePass.new_password2 !== null &&
      changePass.new_password1 !== null
    ) {
      if (changePass.new_password2.length < 8) {
        toast.error("حداقل ۸ کاراکتر نیاز است.");
        return true;
      }
      if (changePass.new_password2 !== changePass.new_password1) {
        toast.error("رمز وارد شده یکسان نمی‌‌‌‌‌باشد.");
        return true;
      }
    }
  };

  const changePassword = async () => {
    if (!changeValidations()) {
      try {
        const response = await axiosInstance.put(
          "/users/api/user/reset-password/",
          changePass
        );
        if (response.status === 200){
            toast.success("رمز عبور شما با موفقیت تغییر یافت.");
            props.closeModal();
        }
      } catch (e) {
        toast.error("رمز عبور فعلی شما اشتباه می باشد");
      }
    }
  };
  return (
    <div className="form-group rtl">
      <input
        className="form-control mr-sm-2 custom-input amount-input mt-1"
        type="password"
        value={changePass.old_password}
        onChange={event => {
          setChangePass({
            ...changePass,
            old_password: event.target.value
          });
        }}
        placeholder={i18next.t("currentPass")}
      />
      <input
        className="form-control mr-sm-2 custom-input amount-input mt-1"
        type="password"
        value={changePass.new_password1}
        onChange={event => {
          setChangePass({
            ...changePass,
            new_password1: event.target.value
          });
        }}
        placeholder={i18next.t("newPass")}
      />
      <input
        className="form-control mr-sm-2 custom-input amount-input mt-1"
        type="password"
        value={changePass.new_password2}
        onChange={event => {
          setChangePass({
            ...changePass,
            new_password2: event.target.value
          });
        }}
        placeholder={i18next.t("repeatPass")}
      />
      <Button onClick={changePassword} className="btn-custom pointer">
        {i18next.t("submit")}
      </Button>
    </div>
  );
};
export default withNamespaces()(ResetPassword);
