Hi! This is a simplistic wrapper for Unix'es Xvfb virtual framebuffer.
You might use it to provide virtual screen for your headful Puppeteer or other screen-dependent software you might want to run in Docker.

## Usage

**Static**

```
const virtualDisplay = XVFB.create();
// virtualDisplay.id -- screen id, as in "Xvfb :YOUR_DISPLAY_ID"
// virtualDisplay.pid -- PID you might want to use once you want to terminate this display

XVFB.kill(id)
// also, you can pass the whole object

```

**Object-oriented**

```
const virtualDisplay = new XVFB();
XVFB.kill()
```
