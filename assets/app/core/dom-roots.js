export function getPublicDomRoots(documentRef = document) {
  return {
    heroNotebook: documentRef.getElementById("heroNotebook"),
    heroPressure: documentRef.getElementById("heroPressure"),
    heroPrincipleFocus: documentRef.getElementById("heroPrincipleFocus"),
    heroLanyard: documentRef.getElementById("heroLanyard"),
    heroSongSearchForm: documentRef.getElementById("heroSongSearchForm"),
    heroSongSearchInput: documentRef.getElementById("tailarkSongSearch"),
    heroSongSearchResults: documentRef.getElementById("heroSongSearchResults"),
    levelBoard: documentRef.getElementById("levelBoard"),
    levelSongPicker: documentRef.getElementById("levelSongPicker"),
    songDetail: documentRef.getElementById("songDetail")
  };
}
