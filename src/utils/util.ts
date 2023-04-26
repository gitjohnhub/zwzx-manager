export default{
  downloadFile(content:string,filename:string){
    const blob = new Blob([content], {type: "application/msword"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename + ".doc";

    // 添加链接到页面中并触发下载
    document.body.appendChild(link);
    link.click();

    // 释放URL对象
    URL.revokeObjectURL(link.href);
  }
}