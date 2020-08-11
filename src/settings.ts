"use babel";

import { Inkdrop } from "./types";

declare var inkdrop: Inkdrop;

const defaultWidth = 200;

class Settings {
  fontFamily: string = "";
  currentWidth: number = 0;
  _settingWidth: number = 0;

  constructor() {
    // fontFamily
    inkdrop.config.observe("editor.fontFamily", (newValue: string) => {
      this.fontFamily = newValue;
    });
    // width
    inkdrop.config.observe("outliner.width", (newValue: number) => {
      if (newValue == null || newValue < 10) {
        newValue = defaultWidth;
      }
      this._settingWidth = newValue;
      this.currentWidth = newValue;
      document.documentElement.style.setProperty(
        "--inkdrop-outliner-width",
        this.currentWidth.toString(10) + "px"
      );
    });
  }
}

export default new Settings();
