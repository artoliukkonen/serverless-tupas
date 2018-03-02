# serverless-tupas

TUPAS identification module for NodeJS built on Serverless framework.

## Why only one handler?

Keeping all code in one Lambda helps you to keep your code "warm" without need for other hacks. It also reduces the amount of AWS specific boilerplate code and keeps it in one place. 

# Getting started

## Install service & dependencies

```
sls install -u https://github.com/artoliukkonen/serverless-tupas
cd serverless-tupas
yarn
```

## Next steps

* Edit `serverless.yml` `service` to something unique
* Run `sls offline start` to start in offline mode
* Open `example/index.html` to test flow in browser

## Credits

Made with ♥ by Arto Liukkonen @ Nordcloud

TUPAS functionality partly based on [node-tupas](https://github.com/reaktor/node-tupas)