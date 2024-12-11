if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
} else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
} else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
}

