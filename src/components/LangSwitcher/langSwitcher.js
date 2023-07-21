import { Button, ButtonGroup } from "@mui/material";

import { useLocale } from 'next-intl';
import { usePathname } from 'next-intl/client';
import { useRouter } from 'next/navigation';

export const LangSwitcher = () => {
  const lngs = {
    en: { nativeName: "En" },
    ru: { nativeName: "Ru" },
  };
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <ButtonGroup variant="contained" sx={{ boxShadow: "none" }}>
      {Object.keys(lngs).map((lng) => (
        <Button

          sx={{
            p: "0",
            fontWeight: locale === lng ? "normal" : "bold",
            minWidth: "20px",
            color: locale === lng ? "gray" : "primary.main",
            backgroundColor: locale === lng ? "transparent" : "#fff"
          }}
          key={lng}
          type="submit"
          onClick={async () => router.replace(`/${lng}/${pathname}`)}
        >
          {lngs[lng].nativeName}
        </Button>
      ))}
    </ButtonGroup>
  );
};
