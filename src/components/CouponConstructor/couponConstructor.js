import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {addCoupon} from "@reducers/currentQuestSlice";

// MUI Comps
import { TextField, Button } from "@mui/material";
import {useTranslations} from 'next-intl';


// Custom Comps
import {Coupon} from "./coupon/coupon";

export const CouponConstructor = ({questTheme, handleClose}) => {
  const t = useTranslations("coupon");

  const currentQuest = useSelector(
    (state) => state.currentQuestReducer.currentQuest
  );
  const [title, setTitle] = useState(currentQuest.rewards !== null ? currentQuest.rewards[0].message : '')
  const [promoCode, setPromoCode] = useState(currentQuest.rewards !== null ? currentQuest.rewards[0].value : '');
  const dispatch = useDispatch()

  const onCouponSave = () => {
    dispatch(addCoupon({
      type: 'coupon',
      message: title,
      value: promoCode,
    }));
    handleClose();
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <Coupon questTheme={questTheme} data={{message: title, value: promoCode}}/>
      <TextField
        required
        fullWidth
        inputProps={{maxLength: '33'}}
        helperText={t("coupon.text_hint")}
        sx={{mb: {xs: 3, sm: 4}}}
        id="outlined-basic-title"
        label={t("coupon.text")}
        type="text"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        // required
        fullWidth
        inputProps={{maxLength: '13'}}
        helperText={t("coupon.promocode_hint")}
        sx={{mb: {xs: 3, sm: 4}}}
        id="outlined-basic-promo"
        label={t("coupon.promocode")}
        type="text"
        variant="outlined"
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
      />
      <Button
        fullWidth
        // type="submit"
        sx={{mb: {xs: 4, sm: 6}}}
        variant="contained"
        size="large"
        // disabled={isEmptyField}
        onClick={onCouponSave}
      >{t("save")}
      </Button>
    </div>
  );
};
