# Team Name - resol

To run resol, the process is pretty simple. 

A much more in depth explanation is given in our final documentation under the user guide seciton,
however a general overview is also given here.

First, clone the repository.

Second, navigate to dapp-scaffold-main folder (~/resol/NextStarter/dapp-scaffold-main)

Third, copy example.db.json, and paste it in the same folder example.db.json is under the name 'db.json'

Fourth, run 'npm install'

Fifth, run 'npm run build'

Sixth, run 'npm run start'

This will run Resol in the production environment.

It is important to note, that each time you start resol, be sure you always go to the index page first.
This is really easy, simply go to http://localhost:3000/ each time. If you attempt to load into the other pages before the index page has been run, the database will not be accessible. This was more or less a design decision, as we wanted to be sure our local database was only running when Resol was running, so we only start it when that page is loaded in. This does not mean that you cannot visit the index page more than once, it does not 'restart' the database or anything like that.