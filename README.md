## Tenage Mutant Ninja Turtles (TMNT)

#### Prereqs

[Docker Compose](https://docs.docker.com/compose/install/)

#### Launch
```
$ docker-compose up
```
```
http://0.0.0.0:3000/
```

#### How To Use

1. In a terminal run `docker-compose up` in this project's root folder 
2. In Chrome web browser go to `http://0.0.0.0:3000/`
3. Click `Load`
4. Enjoy

#### Loading New Data
Replace the file in `/data` with a new .txt file containing a sequence of 'L,F,R' characters, then click `Load` in web app.

#### Limitations

- only 1 .txt file can be present in `/data` folder for loading
- UI is not visually responsive when changing screen width after app is loaded

#### Misc
[Icon Generator](https://favicon.io/favicon-converter/)
