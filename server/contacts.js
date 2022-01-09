var express = require('express');
var fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

var datafile = 'server/contacts.json';
//var router = express.Router();

/* GET all contacts and POST new contacts */
app
    .get('/contacts', function (req, res) {
        var data = getContactData();
        res.send(data);
    })

    .post('/contacts', function (req, res) {

        var data = getContactData();
        var nextID = getNextAvailableID(data);

        var newContact = {
            contactId: nextID,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthday: req.body.birthday,
            telephones: req.body.telephones,
            addresses: req.body.addresses
        };

        data.push(newContact);

        saveContactData(data);

        res.status(201).send(newContact);
    });


/* GET, PUT and DELETE individual books */
app

    .get('/contacts/:id', function (req, res) {

        var data = getContactData();

        var matchingContact = data.filter(function (item) {
            return item.contactId == req.params.id;
        });

        if (matchingContact.length === 0) {
            res.sendStatus(404);
        } else {
            res.send(matchingContact[0]);
        }
    })

    .delete('/contacts/:id', function (req, res) {

        var data = getContactData();

        var pos = data.map(function (item) {
            return parseInt(item.contactId, 10);
        }).indexOf(parseInt(req.params.id, 10));

        if (pos > -1) {
            data.splice(pos, 1);
        } else {
            res.sendStatus(404);
        }

        saveContactData(data);
        res.sendStatus(204);

    })

    .put('/contacts/:id', function (req, res) {

        var data = getContactData();

        var matchingContact = data.filter(function (item) {
            return item.contactId == req.params.id;
        });

        if (matchingContact.length === 0) {
            res.sendStatus(404);
        } else {

            var contactToUpdate = matchingContact[0];
            contactToUpdate.firstName = req.body.firstName;
            contactToUpdate.lastName = req.body.lastName;
            contactToUpdate.birthday = req.body.birthday;
            contactToUpdate.telephones = req.body.telephones;
            contactToUpdate.addresses = req.body.addresses;
           
            saveContactData(data);
            res.sendStatus(204);

        }
    });

function getNextAvailableID(allContacts) {

    var maxID = 0;

    allContacts.forEach(function (element, index, array) {

        console.log(parseInt(element.contactId , 10));
        if (parseInt(element.contactId , 10)> maxID) {
            maxID = parseInt(element.contactId , 10);
        }

    });

    maxID = maxID + 1;
    console.log(maxID);
    console.log(maxID.toString());
    return maxID.toString();

}

function getContactData() {
    var data = fs.readFileSync(datafile, 'utf8');
    return JSON.parse(data);
}

function saveContactData(data) {
    fs.writeFile(datafile, JSON.stringify(data), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

app.listen(4201, () => {
    console.log("Listening on port 4201 " + (new Date()).toISOString());
});


