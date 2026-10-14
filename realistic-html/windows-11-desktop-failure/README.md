# Windows 11 desktop failure

Open `index.html` in a browser. Windows boots and shows Welcome, but no desktop loads. Forty-five overlapping simulated CMD windows appear, each saying **Your desktop failed to load!** The sequence then displays Restarting and ends on a completely black screen representing the requested blank UEFI display.

The sequence lasts about 15 seconds. Move the pointer to reveal Replay boot and Fullscreen; Escape exits fullscreen. The final screen remains blank indefinitely unless replayed.

All windows are HTML elements within the page. No actual CMD windows open, no commands execute, and the computer does not restart or enter firmware.
