"use babel";
var defaultWidth = 200;
var Settings = /** @class */ (function () {
    function Settings() {
        var _this = this;
        this.fontFamily = "";
        this.currentWidth = 0;
        this._settingWidth = 0;
        // fontFamily
        inkdrop.config.observe("editor.fontFamily", function (newValue) {
            _this.fontFamily = newValue;
        });
        // width
        inkdrop.config.observe("outliner.width", function (newValue) {
            if (newValue == null || newValue < 10) {
                newValue = defaultWidth;
            }
            _this._settingWidth = newValue;
            _this.currentWidth = newValue;
            document.documentElement.style.setProperty("--inkdrop-outliner-width", _this.currentWidth.toString(10) + "px");
        });
    }
    return Settings;
}());
export default new Settings();
