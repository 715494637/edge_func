import { JsonBook } from "./SfacgInterface.ts";



 export function JsonToTxt(Json: JsonBook) {
    let txtContent = "";
    txtContent += `作者: ${Json.author}\n`;
    txtContent += `分享者: ${Json.publisher}\r\n`;
    txtContent += `简介:\n${Json.intro}\r\n\n`;
    Json.content.forEach((volume, index) => {
      txtContent += `第${index + 1}卷： ${volume.vtitle}\r\n`;
      volume.chapters.forEach((chapter) => {
        txtContent += `\n${chapter?.ctitle}\n`;
        txtContent += `${chapter?.data}\n`;
      });
      txtContent += "\n";
    });
    return txtContent;
  }

