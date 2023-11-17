import React from "react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import satori, { SatoriOptions } from "satori";
import { SITE } from "@config";
import fontRegularPath from "./NotoSansSC-Regular.otf";
import fontMediumPath from "./NotoSansSC-Medium.otf";
import bg from "../../public/assets/PyCharm_1920x1920.svg";

console.log("%c Line:11 🥐 bg", "color:#42b983", bg);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("%c Line:8 🌰 __dirname", "color:#ea7e5c", __dirname);

const fetchFonts = async () => {
  // Regular Font
  const fontRegular = fs.readFileSync(
    path.join(__dirname, "../../", fontRegularPath)
  );

  // const fontRegular: ArrayBuffer = await fontFileRegular.arrayBuffer();

  // Bold Font
  const fontBold = fs.readFileSync(
    path.join(__dirname, "../../", fontMediumPath)
  );

  return { fontRegular, fontBold };
};

const { fontRegular, fontBold } = await fetchFonts();

const ogImage = (text: string) => {
  return (
    <div
    style={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
      fontSize: 32,
      fontWeight: 600,
    }}
  >
    <img
      src="https://raw.githubusercontent.com/zhanglun/zhanglun.github.io/master/public/assets/PyCharm_1920x1920.svg"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      }}
    />
    <div style={{
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: "rgba(0,0,0,0.2)"
    }}></div>
    <div
      style={{
        color: "#fff",
        fontSize: "50px",
        textAlign: "center",
        backgroundColor: "rgba(0,0,0,0.77)",
        padding: "24px 30px",
        borderRadius: "40px",
        maxWidth: "80%",
      }}
    >
      {text}
    </div>
    <div
      style={{
        display: "flex",
        padding: "40px",
      }}
    >
      <img
        src="https://raw.githubusercontent.com/zhanglun/zhanglun.github.io/master/public/assets/icon.png"
        style={{ width: "66px", height: "66px", borderRadius: "50%" }}
      />
    </div>
  </div>
  );
};

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: "NotoSansSC",
      data: fontRegular,
      weight: 400,
      style: "normal",
    },
    {
      name: "NotoSansSC",
      data: fontBold,
      weight: 600,
      style: "normal",
    },
  ],
};

const generateOgImage = async (mytext = SITE.title) =>
  await satori(ogImage(mytext), options);

export default generateOgImage;
