- Basic setup
```
npm run setup
```

- Clean setup (If you get "npm ERR! code ELIFECYCLE" running this was reported to solve on Windows 10)
```
npm cache verify
npm run clean-setup
```
If doesn't work you may also consider to run:
```
npm cache clean --force
npm run clean-setup
```

- Starts Back-End and Front-End together (With Colors, Time and FE-BE tag)
```
node launcher.js
```

- Starts Back-End and Front-End together (Time and FE-BE tag)
```
npm run dev-bundle
```

- Starts just Back-End
```
npm run server
```

- Starts just Front-End
```
npm run dev-client
```

- Build React Front-End
```
npm run build-client
```

- Serves builded React Front-end
```
npm run prod-client
```

- Serves builded React Front-end
```
npm run prod-client
```
