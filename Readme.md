## Subordination

Subordination is a desktop application for translating and editing subtitles. Currently only SRT is supported.

### Building from source

Subordination is an [Electron](http://electron.atom.io/) app. It's written in JavaScript with extensive use of [Vue.js](http://vuejs.org/), [Vuex](https://github.com/vuejs/vuex) and highly customised version of [Photon](http://photonkit.com/). Note that you need to have [npm](https://www.npmjs.com/) and [git](https://git-scm.com/) installed on you machine. First get the source code:

```
git clone https://github.com/sunabozu/subordination.git
cd subordination
```

Now install the dependencies for development and runtime. Note that the `webchimera.js` package may fail to install. It's a native module and npm will try to compile it from source, but it's not necessary, because Subordination loads its binary version separately. Just ignore all errors related to it.

Also note that Subordination uses a project structure with two `package.json` files. [See more for details](https://github.com/electron-userland/electron-builder).

```
cd app
npm run prepare
cd ..
npm install
```

Now you can build and launch a debug version:

```
npm run build-dev
npm start
```

Or you can try to build a full-fledged binary. All the executables are stored inside the `installers` folder.

```
npm run build-release
npm run dist:osx
npm run dist:win
```

### A Linux version

Currently Subordination is available only on Mac and Windows. The author doesn't use Linux on desktop and can't create anything decent for it. But there is no fundamental problem with it. All the components used in Subordinations can be run on Linux as well. If you want to contribute, please let me know, I'd gladly accept your pull requests.