import React from "react";
import { Button, Typography } from "@mui/material";

import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { QrCodeScanner } from "@components/QrCodeReader/html5QrCode";
import { useTranslations } from "next-intl";

export const QRStep = ({ qrCodeAnswer }) => {
  const t = useTranslations('common');
  const { success } = useSelector((state) => state.questExecutionReducer);
  const [toggleScanQR, setToggleScanQR] = useState(true);
  useEffect(() => {
    if (!success) {
      setToggleScanQR(true);
    }
  }, [success]);
  return (
    <>
      {qrCodeAnswer && <Typography sx={{ textAlign: "center", fontSize: "14px" }}>{qrCodeAnswer}</Typography>}
      {!toggleScanQR && !qrCodeAnswer && <QrCodeScanner success={success} />}
      {toggleScanQR && (
        <Button onClick={() => setToggleScanQR(false)}>
          {t("scan_code")}
        </Button>
      )}
    </>
  );
};
