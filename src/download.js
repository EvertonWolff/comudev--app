export function Download(content, filename, contentType){
    if(!contentType){
        contentType = 'application/octet-stream';
    }
    var a = document.createElement('a');
    var blob = new Blob([content], {'type':contentType});
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}